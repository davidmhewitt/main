/*
Copyright 2019 Javier Brea
Copyright 2019 XbyOrange

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const sinon = require("sinon");

const CoreMocks = require("./Core.mocks.js");
const ServerMocks = require("./server/Server.mocks.js");
const MocksMock = require("./mocks/Mocks.mock.js");
const LegacyMocksMock = require("./mocks-legacy/Mocks.mocks.js");

const Orchestrator = require("../src/Orchestrator");

describe("Orchestrator", () => {
  let sandbox;
  let serverMocks;
  let coreMocks;
  let coreInstance;
  let legacyMocksMock;
  let mocksMock;
  let orchestrator;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    serverMocks = new ServerMocks();
    coreMocks = new CoreMocks();
    legacyMocksMock = new LegacyMocksMock();
    mocksMock = new MocksMock();
    coreInstance = coreMocks.stubs.instance;
    orchestrator = new Orchestrator(
      coreInstance._eventEmitter,
      legacyMocksMock.stubs.instance,
      serverMocks.stubs.instance,
      mocksMock.stubs.instance
    );
    expect.assertions(1);
  });

  afterEach(() => {
    sandbox.restore();
    legacyMocksMock.restore();
    coreMocks.restore();
    serverMocks.restore();
    mocksMock.restore();
  });

  describe("when settings change", () => {
    it("should restart the server when port changes", async () => {
      expect.assertions(2);
      coreInstance._eventEmitter.on.getCall(0).args[1]({
        port: 4540,
      });
      expect(serverMocks.stubs.instance.restart.callCount).toEqual(1);
      expect(orchestrator).toBeInstanceOf(Orchestrator);
    });

    it("should restart the server when host changes", async () => {
      coreInstance._eventEmitter.on.getCall(0).args[1]({
        host: "foo-new-host",
      });
      expect(serverMocks.stubs.instance.restart.callCount).toEqual(1);
    });

    it("should do nothing when no port nor host are changed", async () => {
      coreInstance._eventEmitter.on.getCall(0).args[1]({
        foo: true,
      });
      expect(serverMocks.stubs.instance.restart.callCount).toEqual(0);
    });

    it("should set new behavior as current one if behavior has changed", async () => {
      coreInstance._eventEmitter.on.getCall(0).args[1]({
        behavior: "behavior2",
      });
      expect(legacyMocksMock.stubs.instance.behaviors.current).toEqual("behavior2");
    });

    it("should set new mock as current one if mock has changed", async () => {
      coreInstance._eventEmitter.on.getCall(0).args[1]({
        mock: "mock2",
      });
      expect(mocksMock.stubs.instance.current).toEqual("mock2");
    });
  });

  describe("when core emits load:mocks:legacy", () => {
    it("should process fixtures and behaviors again", async () => {
      coreInstance._eventEmitter.on.getCall(1).args[1]();
      expect(legacyMocksMock.stubs.instance.processLoadedMocks.callCount).toEqual(1);
    });
  });

  describe("when core emits load:mocks", () => {
    it("should not call to load mocks if load:routes was not emitted", async () => {
      coreInstance._eventEmitter.on.getCall(3).args[1]();
      expect(mocksMock.stubs.instance.load.callCount).toEqual(0);
    });

    it("should call to load mocks if load:routes was emitted", async () => {
      coreInstance._eventEmitter.on.getCall(2).args[1]();
      coreInstance._eventEmitter.on.getCall(3).args[1]();
      expect(mocksMock.stubs.instance.load.callCount).toEqual(1);
    });
  });

  describe("when core emits load:routes", () => {
    it("should not call to load mocks if load:mocks was not emitted", async () => {
      coreInstance._eventEmitter.on.getCall(2).args[1]();
      expect(mocksMock.stubs.instance.load.callCount).toEqual(0);
    });

    it("should call to load mocks if load:mocks was emitted", async () => {
      coreInstance._eventEmitter.on.getCall(3).args[1]();
      coreInstance._eventEmitter.on.getCall(2).args[1]();
      expect(mocksMock.stubs.instance.load.callCount).toEqual(1);
    });
  });
});
