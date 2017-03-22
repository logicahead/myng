"use strict";
var dynamic_checkbox_group_model_1 = require("./dynamic-checkbox-group.model");
var dynamic_checkbox_model_1 = require("./dynamic-checkbox.model");
describe("DynamicCheckboxGroupModel test suite", function () {
    var model, config = {
        id: "checkboxGroup",
        group: [
            new dynamic_checkbox_model_1.DynamicCheckboxModel({
                id: "checkbox1",
                label: "Checkbox 1",
                value: true
            }),
            new dynamic_checkbox_model_1.DynamicCheckboxModel({
                id: "checkbox2",
                label: "Checkbox 2",
                value: false
            }),
            new dynamic_checkbox_model_1.DynamicCheckboxModel({
                id: "checkbox3",
                label: "Checkbox 3",
                value: false
            })
        ]
    };
    beforeEach(function () { return model = new dynamic_checkbox_group_model_1.DynamicCheckboxGroupModel(config); });
    it("should initialize correctly", function () {
        expect(model.id).toEqual(config.id);
        expect(model.group.length).toBe(config.group.length);
        expect(model.legend).toBeNull();
        expect(model.type).toEqual(dynamic_checkbox_group_model_1.DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP);
    });
    it("should check checkboxes correctly", function () {
        model.check(0, 2);
        expect(model.group[0].value).toBe(true);
        expect(model.group[2].value).toBe(true);
    });
    it("should check all checkboxes correctly", function () {
        model.checkAll();
        expect(model.group[0].value).toBe(true);
        expect(model.group[1].value).toBe(true);
        expect(model.group[2].value).toBe(true);
    });
    it("should uncheck checkboxes correctly", function () {
        model.uncheck(0, 2);
        expect(model.group[0].value).toBe(false);
        expect(model.group[2].value).toBe(false);
    });
    it("should uncheck all checkboxes correctly", function () {
        model.uncheckAll();
        expect(model.group[0].value).toBe(false);
        expect(model.group[1].value).toBe(false);
        expect(model.group[2].value).toBe(false);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.type).toEqual(dynamic_checkbox_group_model_1.DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.type).toEqual(dynamic_checkbox_group_model_1.DYNAMIC_FORM_CONTROL_TYPE_CHECKBOX_GROUP);
    });
});

//# sourceMappingURL=dynamic-checkbox-group.model.spec.js.map
