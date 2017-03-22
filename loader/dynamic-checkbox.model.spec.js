"use strict";
var dynamic_checkbox_model_1 = require("./dynamic-checkbox.model");
describe("DynamicCheckboxModel test suite", function () {
    var model, config = {
        id: "checkbox",
        value: true
    };
    beforeEach(function () { return model = new dynamic_checkbox_model_1.DynamicCheckboxModel(config); });
    it("should initialize correctly", function () {
        expect(model.align).toEqual(dynamic_checkbox_model_1.DYNAMIC_FORM_CONTROL_CHECKBOX_ALIGN_START);
        expect(model.asyncValidators).toEqual(null);
        expect(model.disabled).toBe(false);
        expect(model.id).toEqual(config.id);
        expect(model.indeterminate).toBe(false);
        expect(model.label).toBeNull();
        expect(model.name).toEqual(model.id);
        expect(model.type).toEqual(dynamic_checkbox_model_1.DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX);
        expect(model.validators).toEqual(null);
        expect(model.value).toBe(config.value);
    });
    it("should get and set checked property correctly", function () {
        expect(model.checked).toBe(config.value);
        model.checked = false;
        expect(model.checked).toBe(false);
        expect(model.value).toBe(false);
    });
    it("should toggle correctly", function () {
        model.toggle();
        expect(model.checked).toBe(!config.value);
        expect(model.value).toBe(!config.value);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.value).toBe(model.value);
        expect(json.type).toEqual(dynamic_checkbox_model_1.DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX);
    });
});

//# sourceMappingURL=dynamic-checkbox.model.spec.js.map
