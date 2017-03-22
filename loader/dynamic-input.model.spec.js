"use strict";
var dynamic_input_model_1 = require("./dynamic-input.model");
var dynamic_form_autofill_service_1 = require("../../service/dynamic-form-autofill.service");
describe("DynamicInputModel test suite", function () {
    var model, config = {
        id: "input",
        list: ["One", "Two", "Three"]
    };
    beforeEach(function () { return model = new dynamic_input_model_1.DynamicInputModel(config); });
    it("tests if correct default type property is set", function () {
        expect(model.type).toEqual(dynamic_input_model_1.DYNAMIC_FORM_CONTROL_TYPE_INPUT);
    });
    it("tests if correct default input type property is set", function () {
        expect(model.inputType).toEqual(dynamic_input_model_1.DYNAMIC_FORM_CONTROL_INPUT_TYPE_TEXT);
    });
    it("tests if correct default autoComplete property is set", function () {
        expect(model.autoComplete).toEqual(dynamic_form_autofill_service_1.AUTOCOMPLETE_ON);
    });
    it("tests if correct default autoFocus property is set", function () {
        expect(model.autoFocus).toBe(false);
    });
    it("tests if correct default cls properties aree set", function () {
        expect(model.cls).toBeDefined();
        expect(model.cls.element.container).toEqual("");
        expect(model.cls.element.control).toEqual("");
        expect(model.cls.element.errors).toEqual("");
        expect(model.cls.element.label).toEqual("");
        expect(model.cls.grid.container).toEqual("");
        expect(model.cls.grid.control).toEqual("");
        expect(model.cls.grid.errors).toEqual("");
        expect(model.cls.grid.label).toEqual("");
    });
    it("tests if correct default hint property is set", function () {
        expect(model.hint).toBeNull();
    });
    it("tests if correct default label property is set", function () {
        expect(model.label).toBeNull();
    });
    it("tests if correct default list property is set", function () {
        expect(model.list).toEqual(config.list);
    });
    it("tests if correct default max property is set", function () {
        expect(model.max).toBeNull();
    });
    it("tests if correct default maxLength property is set", function () {
        expect(model.maxLength).toBeNull();
    });
    it("tests if correct default minLength property is set", function () {
        expect(model.minLength).toBeNull();
    });
    it("tests if correct default min property is set", function () {
        expect(model.min).toBeNull();
    });
    it("tests if correct default placeholder property is set", function () {
        expect(model.placeholder).toEqual("");
    });
    it("tests if correct default readonly property is set", function () {
        expect(model.readOnly).toBe(false);
    });
    it("tests if correct default required property is set", function () {
        expect(model.required).toBe(false);
    });
    it("tests if correct default spellcheck property is set", function () {
        expect(model.spellCheck).toBe(false);
    });
    it("tests if correct default step property is set", function () {
        expect(model.step).toBeNull();
    });
    it("tests if correct default prefix property is set", function () {
        expect(model.prefix).toBeNull();
    });
    it("tests if correct default suffix property is set", function () {
        expect(model.suffix).toBeNull();
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.disabled).toEqual(model.disabled);
        expect(json.value).toBe(model.value);
        expect(json.type).toEqual(dynamic_input_model_1.DYNAMIC_FORM_CONTROL_TYPE_INPUT);
    });
});

//# sourceMappingURL=dynamic-input.model.spec.js.map
