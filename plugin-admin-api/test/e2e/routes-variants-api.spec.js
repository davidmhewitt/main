/*
Copyright 2019 Javier Brea

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

const { startServer, fetch, waitForServer } = require("./support/helpers");

describe("routes variants api", () => {
  let server;

  beforeAll(async () => {
    server = await startServer("web-tutorial");
    await waitForServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe("get /", () => {
    it("should return routes variants", async () => {
      const response = await fetch("/admin/routes-variants");
      expect(response.body).toEqual([
        {
          id: "get-user:1",
          routeId: "get-user",
          handler: "default",
          response: { body: { id: 1, name: "John Doe" }, status: 200 },
          delay: null,
        },
        {
          id: "get-user:2",
          routeId: "get-user",
          handler: "default",
          response: { body: { id: 2, name: "Jane Doe" }, status: 200 },
          delay: null,
        },
        {
          id: "get-user:real",
          routeId: "get-user",
          handler: "default",
          response: "function",
          delay: null,
        },
        {
          id: "get-users:success",
          routeId: "get-users",
          handler: "default",
          response: {
            body: [
              { id: 1, name: "John Doe" },
              { id: 2, name: "Jane Doe" },
            ],
            status: 200,
          },
          delay: null,
        },
        {
          id: "get-users:error",
          routeId: "get-users",
          handler: "default",
          response: { body: { message: "Bad data" }, status: 403 },
          delay: null,
        },
      ]);
    });
  });

  describe("get /get-user:1", () => {
    it("should return route variant with id get-user:1", async () => {
      const response = await fetch("/admin/routes-variants/get-user:1");
      expect(response.body).toEqual({
        id: "get-user:1",
        routeId: "get-user",
        handler: "default",
        response: { body: { id: 1, name: "John Doe" }, status: 200 },
        delay: null,
      });
    });
  });

  describe("get /get-user:2", () => {
    it("should return route variant with id get-user:2", async () => {
      const response = await fetch("/admin/routes-variants/get-user:2");
      expect(response.body).toEqual({
        id: "get-user:2",
        routeId: "get-user",
        handler: "default",
        response: { body: { id: 2, name: "Jane Doe" }, status: 200 },
        delay: null,
      });
    });
  });

  describe("get unexistant route variant", () => {
    it("should return a not found error", async () => {
      const response = await fetch("/admin/routes-variants/foo");
      expect(response.status).toEqual(404);
      expect(response.body.message).toEqual('Route variant with id "foo" was not found');
    });
  });
});
