"use strict";
var dynamic_form_group_model_1 = require("./dynamic-form-group.model");
var dynamic_input_model_1 = require("../input/dynamic-input.model");
describe("DynamicFormGroupModel test suite", function () {
    var model, config = {
        id: "formGroup",
        group: [
            new dynamic_input_model_1.DynamicInputModel({
                id: "defaultInput"
            })
        ],
        validator: { required: null }
    };
    beforeEach(function () { return model = new dynamic_form_group_model_1.DynamicFormGroupModel(config); });
    it("should initialize correctly", function () {
        expect(model.id).toEqual(config.id);
        expect(model.group.length).toBe(1);
        expect(model.legend).toBeNull();
        expect(model.type).toEqual(dynamic_form_group_model_1.DYNAMIC_FORM_CONTROL_TYPE_GROUP);
        expect(model.asyncValidator).toBeNull();
        expect(model.validator).toBeDefined();
    });
    it("should throw when no group array is specified", function () {
        expect(function () { return new dynamic_form_group_model_1.DynamicFormGroupModel({ id: "test" }); })
            .toThrow(new Error("group array must be specified for DynamicFormGroupModel"));
    });
    it("should get the correct DynamicFormControlModel of group", function () {
        expect(model.get(0)).toEqual(model.group[0]);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.type).toEqual(dynamic_form_group_model_1.DYNAMIC_FORM_CONTROL_TYPE_GROUP);
        expect(Object.keys(json.validator)[0]).toEqual("required");
    });
});

//# sourceMappingURL=dynamic-form-group.model.spec.js.map
