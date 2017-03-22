"use strict";
var dynamic_form_array_model_1 = require("./dynamic-form-array.model");
var dynamic_input_model_1 = require("../input/dynamic-input.model");
describe("DynamicFormArrayModel test suite", function () {
    var model, config = {
        id: "formArray",
        initialCount: 3,
        createGroup: function () { return [new dynamic_input_model_1.DynamicInputModel({ id: "defaultInput" })]; },
        validator: { required: null }
    };
    beforeEach(function () { return model = new dynamic_form_array_model_1.DynamicFormArrayModel(config); });
    it("should initialize correctly", function () {
        expect(model.initialCount).toBe(config.initialCount);
        expect(model.size).toBe(model.initialCount);
        expect(model.id).toEqual(config.id);
        expect(model.type).toEqual(dynamic_form_array_model_1.DYNAMIC_FORM_CONTROL_TYPE_ARRAY);
        expect(model.asyncValidator).toBeNull();
        expect(model.validator).toBeDefined();
        expect(model.createGroup().length).toEqual(1);
        expect(model.removeGroup).toBeDefined();
    });
    it("should throw when no createGroup function is specified", function () {
        expect(function () { return new dynamic_form_array_model_1.DynamicFormArrayModel({ id: "test" }); })
            .toThrow(new Error("createGroup function must be specified for DynamicFormArrayModel"));
    });
    it("should get the correct group model", function () {
        expect(model.get(0) instanceof dynamic_form_array_model_1.DynamicFormArrayGroupModel).toBe(true);
        expect(model.get(1) instanceof dynamic_form_array_model_1.DynamicFormArrayGroupModel).toBe(true);
    });
    it("should add another form array group", function () {
        model.addGroup();
        expect(model.size).toBe(config.initialCount + 1);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.asyncValidators).toBeUndefined();
        expect(json.id).toEqual(model.id);
        expect(json.groups.length).toEqual(model.size);
        expect(json.type).toEqual(dynamic_form_array_model_1.DYNAMIC_FORM_CONTROL_TYPE_ARRAY);
        expect(Object.keys(json.validator)[0]).toEqual("required");
        expect(json.validators).toBeUndefined();
    });
});

//# sourceMappingURL=dynamic-form-array.model.spec.js.map
