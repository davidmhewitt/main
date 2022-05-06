const sinon = require("sinon");

const { createConfigBeforeElements, wait } = require("../support/helpers");

const Config = require("../../src/Config");

describe("options", () => {
  let sandbox, createConfig, config, namespace, option;

  beforeEach(() => {
    ({ sandbox, createConfig, config, namespace, option } = createConfigBeforeElements());
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("when option is created in root", () => {
    it("should have default value", async () => {
      config = new Config();
      option = config.addOption({
        name: "fooOption",
        type: "string",
        default: "default-str",
      });
      expect(option.value).toEqual("default-str");
      await config.start({ fooOption: "foo-str" });
      expect(option.value).toEqual("foo-str");
    });

    it("should have default value when created using addOptions", async () => {
      config = new Config();
      [option] = config.addOptions([
        {
          name: "fooOption",
          type: "string",
          default: "default-str",
        },
      ]);
      expect(option.value).toEqual("default-str");
      await config.start({ fooOption: "foo-str" });
      expect(option.value).toEqual("foo-str");
    });
  });

  describe("when an option is created", () => {
    it("should have name property", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "string" });
      expect(option.name).toEqual("fooOption");
    });

    it("should throw if option with same name already exist", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "string" });
      expect(() => namespace.addOption({ name: "fooOption", type: "string" })).toThrow(
        "already exists"
      );
    });

    it("should throw if option with same name already exist in root", async () => {
      config = new Config();
      option = config.addOption({ name: "fooOption", type: "string" });
      expect(() => config.addOption({ name: "fooOption", type: "string" })).toThrow(
        "already exists"
      );
    });

    it("should throw if namespace with same name already exist", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      namespace.addNamespace("fooOption");
      expect(() => namespace.addOption({ name: "fooOption", type: "string" })).toThrow(
        "already exists"
      );
    });

    it("should throw if namespace with same name already exist in root", async () => {
      config = new Config();
      config.addNamespace("foo");
      expect(() => config.addOption({ name: "foo", type: "string" })).toThrow("already exists");
    });

    it("should have metaData property", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({
        name: "fooOption",
        type: "string",
        metaData: { restartServer: true },
      });
      expect(option.metaData).toEqual({ restartServer: true });
    });

    it("should throw when type is string and default does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      expect(() =>
        namespace.addOption({ name: "fooOption", type: "string", default: 5 })
      ).toThrowError("default");
    });

    it("should throw when type is not array and itemsType property is added", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      expect(() =>
        namespace.addOption({
          name: "fooOption",
          type: "string",
          itemsType: "number",
          default: "foo",
        })
      ).toThrowError("itemsType");
    });

    it("should throw when type is array and default does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      expect(() =>
        namespace.addOption({ name: "fooOption", type: "array", default: "foo" })
      ).toThrowError("default");
    });

    it("should throw when type is array and contents does not match itemsType", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      expect(() =>
        namespace.addOption({
          name: "fooOption",
          type: "array",
          itemsType: "number",
          default: [1, "foo", 3],
        })
      ).toThrowError("default");
    });

    it("should throw when setting value if type is array and value does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "array" });
      expect(() => (option.value = 5)).toThrowError("5 is not of type array");
    });

    it("should throw when setting value if type is array and contents don't match string type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "array", itemsType: "string" });
      expect(() => (option.value = ["5", "4", 5, "2"])).toThrowError("5 is not of type string");
    });

    it("should set value if type is array and contents match string type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "array", itemsType: "string" });
      option.value = ["5", "4", "5", "2"];
      expect(option.value).toEqual(["5", "4", "5", "2"]);
    });

    it("should throw when setting value if type is array and contents don't match number type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "array", itemsType: "number" });
      expect(() => (option.value = [5, 4, "5", 1])).toThrowError("5 is not of type number");
    });

    it("should set value if type is array and contents match number type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "array", itemsType: "number" });
      option.value = [5, 4, 5, 1];
      expect(option.value).toEqual([5, 4, 5, 1]);
    });

    it("should throw when setting value if type is array and contents don't match boolean type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "array", itemsType: "boolean" });
      expect(() => (option.value = [false, true, 5, false])).toThrowError(
        "5 is not of type boolean"
      );
    });

    it("should set value if type is array and contents match boolean type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "array", itemsType: "boolean" });
      option.value = [false, true, false];
      expect(option.value).toEqual([false, true, false]);
    });

    it("should throw when setting value if type is array and contents don't match object type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "array", itemsType: "object" });
      expect(() => (option.value = [{ foo: "foo" }, "foo"])).toThrowError(
        "foo is not of type object"
      );
    });

    it("should set value if type is array and contents match object type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "array", itemsType: "object" });
      option.value = [{ foo: "foo" }, { foo2: "foo2" }];
      expect(option.value).toEqual([{ foo: "foo" }, { foo2: "foo2" }]);
    });

    it("should throw when setting value if type is string and value does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "string" });
      expect(() => (option.value = 5)).toThrowError("5 is not of type string");
    });

    it("should throw when type is number and default does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      expect(() =>
        namespace.addOption({ name: "fooOption", type: "number", default: "5" })
      ).toThrowError("default");
    });

    it("should throw when setting value if type is number and value does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "number" });
      expect(() => (option.value = "foo")).toThrowError("foo is not of type number");
    });

    it("should throw when type is object and default does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      expect(() =>
        namespace.addOption({ name: "fooOption", type: "object", default: "{}" })
      ).toThrowError("default");
    });

    it("should throw when setting value if type is object and value does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "object" });
      expect(() => (option.value = "foo")).toThrowError("foo is not of type object");
    });

    it("should throw when type is boolean and default does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      expect(() =>
        namespace.addOption({ name: "fooOption", type: "boolean", default: "foo" })
      ).toThrowError("default");
    });

    it("should throw when setting value if type is boolean and value does not match type", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "boolean" });
      expect(() => (option.value = 1)).toThrowError("1 is not of type boolean");
    });
  });

  describe("when an option is deprecated", () => {
    let option2;

    beforeEach(() => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "string" });
      option2 = namespace.addOption({
        name: "fooDeprecatedOption",
        deprecatedBy: option,
        type: "string",
      });
    });

    it("should set the value of the new option also", async () => {
      await config.start();
      expect(option.value).toEqual(undefined);
      expect(option2.value).toEqual(undefined);
      option2.value = "foo-value";
      expect(option.value).toEqual("foo-value");
      expect(option2.value).toEqual("foo-value");
    });

    it("should merge the value of the new option also", async () => {
      config = new Config();
      namespace = config.addNamespace("foo");
      option = namespace.addOption({ name: "fooOption", type: "object" });
      option2 = namespace.addOption({
        name: "fooDeprecatedOption",
        deprecatedBy: option,
        type: "object",
      });
      await config.start();
      option2.merge({ foo: "foo" });
      expect(option.value).toEqual({ foo: "foo" });
      expect(option2.value).toEqual({ foo: "foo" });
    });

    it("should set the value of the new option also from init config", async () => {
      await config.start({ foo: { fooDeprecatedOption: "foo-from-init" } });
      expect(option.value).toEqual("foo-from-init");
      expect(option2.value).toEqual("foo-from-init");
    });
  });

  describe("created options", () => {
    beforeEach(() => {
      ({ config, namespace, option } = createConfig());
    });

    it("option should have name property", async () => {
      expect(option.name).toEqual("fooOption");
    });

    it("option should return default value", async () => {
      await config.init();
      expect(option.value).toEqual("default-str");
    });

    it("option should be initializated when calling to start only", async () => {
      await config.start();
      expect(option.value).toEqual("default-str");
    });

    it("should return default value of options of type object", async () => {
      config = new Config({ moduleName: "testObjectDefault" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        default: { foo: "var" },
        type: "object",
      });
      await config.init();
      expect(option.value).toEqual({ foo: "var" });
    });

    it("should return default value of options of type array", async () => {
      config = new Config({ moduleName: "testObjectDefault" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        default: ["foo", "foo2"],
        type: "array",
        itemsType: "string",
      });
      await config.init();
      expect(option.value).toEqual(["foo", "foo2"]);
    });

    it("option should return new value after setting it", async () => {
      await config.init();
      expect(option.value).toEqual("default-str");
      option.value = "new-str";
      expect(option.value).toEqual("new-str");
    });

    it("option omit undefined when setting value", async () => {
      await config.init();
      expect(option.value).toEqual("default-str");
      option.value = undefined;
      expect(option.value).toEqual("default-str");
    });

    it("option should return new value after setting it when it is of type number", async () => {
      config = new Config({ moduleName: "testnumberSet" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        default: 5,
        type: "number",
      });
      await config.init();
      expect(option.value).toEqual(5);
      option.value = 10;
      expect(option.value).toEqual(10);
    });

    it("option should return new value after setting it when it is of type boolean", async () => {
      config = new Config({ moduleName: "testbooleanSet" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        default: true,
        type: "boolean",
      });
      await config.init();
      expect(option.value).toEqual(true);
      option.value = false;
      expect(option.value).toEqual(false);
    });

    it("option should return new value after merging it when option is of type object", async () => {
      config = new Config({ moduleName: "testObjectSet" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        default: { foo: "var" },
        type: "object",
      });
      await config.init();
      expect(option.value).toEqual({ foo: "var" });
      option.merge({ foo2: "var2" });
      expect(option.value).toEqual({ foo2: "var2", foo: "var" });
    });

    it("option should return new value after merging it when option is of type array", async () => {
      config = new Config({ moduleName: "testObjectSet" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        default: ["foo", "foo2"],
        type: "array",
      });
      await config.init();
      expect(option.value).toEqual(["foo", "foo2"]);
      option.value = ["foo3", "foo4"];
      expect(option.value).toEqual(["foo3", "foo4"]);
    });

    it("option should not merge value if it is undefined when option is of type object", async () => {
      config = new Config({ moduleName: "testObjectSet" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        default: { foo: "var" },
        type: "object",
      });
      await config.init();
      expect(option.value).toEqual({ foo: "var" });
      option.merge(undefined);
      expect(option.value).toEqual({ foo: "var" });
    });

    it("option should emit an event after setting new value", async () => {
      expect.assertions(2);
      let resolver;
      await config.start();
      expect(option.value).toEqual("default-str");
      const promise = new Promise((resolve) => {
        resolver = resolve;
      });
      option.onChange((newValue) => {
        expect(newValue).toEqual("new-str");
        resolver();
      });
      option.value = "new-str";
      return promise;
    });

    it("option should emit an event after setting new value in option in root config", async () => {
      expect.assertions(2);
      let resolver;
      option = config.addOption({
        name: "rootOption",
        type: "string",
        default: "foo-root-value",
      });
      await config.start();
      expect(option.value).toEqual("foo-root-value");
      const promise = new Promise((resolve) => {
        resolver = resolve;
      });
      option.onChange((newValue) => {
        expect(newValue).toEqual("new-str");
        resolver();
      });
      option.value = "new-str";
      return promise;
    });

    it("option should emit an event after setting new value in option in nested namespace", async () => {
      expect.assertions(2);
      let resolver;
      option = namespace.addNamespace("childNamespace").addNamespace("childNamespace").addOption({
        name: "childOption",
        type: "string",
        default: "foo-child-value",
      });
      await config.start();
      expect(option.value).toEqual("foo-child-value");
      const promise = new Promise((resolve) => {
        resolver = resolve;
      });
      option.onChange((newValue) => {
        expect(newValue).toEqual("new-str");
        resolver();
      });
      option.value = "new-str";
      return promise;
    });

    it("option should not emit an event after setting same value", async () => {
      expect.assertions(2);
      const spy = sinon.spy();
      await config.start();
      expect(option.value).toEqual("default-str");
      option.onChange(spy);
      option.value = "default-str";
      await wait();

      expect(spy.callCount).toEqual(0);
    });

    it("option should not emit an event after setting same value if option is of type array", async () => {
      config = new Config({ moduleName: "testObjectSet" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        default: ["foo", "foo2"],
        type: "array",
      });

      expect.assertions(2);
      const spy = sinon.spy();
      await config.start();
      expect(option.value).toEqual(["foo", "foo2"]);
      option.onChange(spy);
      option.value = ["foo", "foo2"];
      await wait();

      expect(spy.callCount).toEqual(0);
    });

    it("option should not emit an event before calling to start", async () => {
      expect.assertions(2);
      const spy = sinon.spy();
      await config.init();
      expect(option.value).toEqual("default-str");
      option.onChange(spy);
      option.value = "foo-str";
      await wait();

      expect(spy.callCount).toEqual(0);
    });

    it("option event should be removed if returned callback is executed", async () => {
      expect.assertions(2);
      const spy = sinon.spy();
      await config.start();
      expect(option.value).toEqual("default-str");
      const removeCallback = option.onChange(spy);
      removeCallback();
      option.value = "foo-str";
      await wait();

      expect(spy.callCount).toEqual(0);
    });

    it("option should emit an event after merging new value when it is of type object", async () => {
      expect.assertions(2);
      let resolver;
      config = new Config({ moduleName: "testObjectSet" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        default: { foo: "var" },
        type: "object",
      });
      await config.start();
      expect(option.value).toEqual({ foo: "var" });
      const promise = new Promise((resolve) => {
        resolver = resolve;
      });
      option.onChange((newValue) => {
        expect(newValue).toEqual({ foo: "var", foo2: "foo" });
        resolver();
      });
      option.merge({ foo2: "foo" });
      return promise;
    });

    it("option should be undefined if no default value is provided", async () => {
      config = new Config({ moduleName: "testObjectSet" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        type: "object",
      });
      await config.init();
      expect(option.value).toEqual(undefined);
    });

    it("option return new value after merging it when it has not default value and option is of type object", async () => {
      config = new Config({ moduleName: "testObjectSet" });
      namespace = config.addNamespace("fooNamespace");
      option = namespace.addOption({
        name: "fooOption",
        type: "object",
      });
      await config.init();
      expect(option.value).toEqual(undefined);
      option.merge({ foo: "var" });
      expect(option.value).toEqual({ foo: "var" });
    });
  });
});
