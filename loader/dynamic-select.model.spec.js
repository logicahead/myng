"use strict";
var dynamic_select_model_1 = require("./dynamic-select.model");
describe("DynamicSelectModel test suite", function () {
    var model, config = {
        id: "select",
        multiple: false,
        options: [
            {
                value: "1",
                label: "One"
            },
            {
                value: "2",
                label: "Two"
            }
        ]
    };
    beforeEach(function () { return model = new dynamic_select_model_1.DynamicSelectModel(config); });
    it("should initialize correctly", function () {
        expect(model.disabled).toBe(false);
        expect(model.id).toEqual(config.id);
        expect(model.label).toBeNull();
        expect(model.multiple).toBe(config.multiple);
        expect(model.name).toEqual(model.id);
        expect(model.options.length).toBe(config.options.length);
        expect(model.type).toEqual(dynamic_select_model_1.DYNAMIC_FORM_CONTROL_TYPE_SELECT);
        expect(model.value).toBeNull();
    });
    it("should get and set text property correctly", function () {
        expect(model.get(0).text).toEqual("One");
        model.get(0).text = "Eins";
        expect(model.get(0).text).toEqual("Eins");
    });
    it("should add another option", function () {
        var option = { label: "test option", value: "test-option" };
        model.add(option);
        expect(model.options.length).toBe(config.options.length + 1);
        expect(model.get(model.options.length - 1).value).toEqual(option.value);
    });
    it("should insert another option", function () {
        var option = { label: "test option", value: "test-option" }, index = 1;
        model.insert(index, option);
        expect(model.options.length).toBe(config.options.length + 1);
        expect(model.get(index).value).toEqual(option.value);
    });
    it("should remove a given option", function () {
        model.remove(1);
        expect(model.options.length).toBe(config.options.length - 1);
    });
    it("should get the correct option", function () {
        expect(model.get(0)).toEqual(model.options[0]);
        expect(model.get(1)).toEqual(model.options[1]);
    });
    it("should select correct option", function () {
        model.select(1);
        expect(model.value).toEqual(model.get(1).value);
    });
    it("should select multiple options", function () {
        model.multiple = true;
        model.select(0, 1);
        expect(model.value).toEqual([model.get(0).value, model.get(1).value]);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.options.length).toBe(model.options.length);
        expect(json.value).toBe(model.value);
        expect(json.type).toEqual(dynamic_select_model_1.DYNAMIC_FORM_CONTROL_TYPE_SELECT);
    });
});

//# sourceMappingURL=dynamic-select.model.spec.js.map
