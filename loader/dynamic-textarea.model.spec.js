"use strict";
var dynamic_textarea_model_1 = require("./dynamic-textarea.model");
describe("DynamicTextAreaModel test suite", function () {
    var model, config = {
        id: "textarea",
        validators: { required: null, minLength: 5 }
    };
    beforeEach(function () { return model = new dynamic_textarea_model_1.DynamicTextAreaModel(config); });
    it("should initialize correctly", function () {
        expect(model.cols).toBe(20);
        expect(model.disabled).toBe(false);
        expect(model.errorMessages).toBeNull();
        expect(model.hasErrorMessages).toBe(false);
        expect(model.id).toEqual(config.id);
        expect(model.label).toBeNull();
        expect(model.name).toEqual(model.id);
        expect(model.rows).toBe(2);
        expect(model.type).toEqual(dynamic_textarea_model_1.DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA);
        expect(model.value).toBeNull();
        expect(model.wrap).toEqual(dynamic_textarea_model_1.DYNAMIC_FORM_TEXTAREA_WRAP_SOFT);
    });
    it("should throw when no model id is specified", function () {
        expect(function () { return new dynamic_textarea_model_1.DynamicTextAreaModel({}); })
            .toThrow(new Error("string id must be specified for DynamicFormControlModel"));
    });
    it("should set disabled property correctly", function () {
        model.disabledUpdates.next(true);
        expect(model.disabled).toBe(true);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.cols).toBe(model.cols);
        expect(Object.keys(json.validators).length).toBe(Object.keys(model.validators).length);
        expect(json.value).toBe(model.value);
        expect(json.type).toEqual(dynamic_textarea_model_1.DYNAMIC_FORM_CONTROL_TYPE_TEXTAREA);
    });
});

//# sourceMappingURL=dynamic-textarea.model.spec.js.map
