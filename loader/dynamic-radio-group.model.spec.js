"use strict";
var dynamic_radio_group_model_1 = require("./dynamic-radio-group.model");
describe("DynamicRadioModel test suite", function () {
    var model, config = {
        id: "radio",
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
    beforeEach(function () { return model = new dynamic_radio_group_model_1.DynamicRadioGroupModel(config); });
    it("should initialize correctly", function () {
        expect(model.disabled).toBe(false);
        expect(model.errorMessages).toBeNull();
        expect(model.hasErrorMessages).toBe(false);
        expect(model.id).toEqual(config.id);
        expect(model.label).toBeNull();
        expect(model.legend).toBeNull();
        expect(model.name).toEqual(model.id);
        expect(model.options.length).toBe(config.options.length);
        expect(model.type).toEqual(dynamic_radio_group_model_1.DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP);
        expect(model.value).toBeNull();
    });
    it("should select the correct option", function () {
        model.select(1);
        expect(model.value).toEqual(model.get(1).value);
    });
    it("should insert another option", function () {
        var option = { label: "test option", value: "test-option" }, index = 1;
        model.insert(index, option);
        expect(model.options.length).toBe(config.options.length + 1);
        expect(model.get(index).value).toEqual(option.value);
    });
    it("should remove a given option correctly", function () {
        model.remove(1);
        expect(model.options.length).toBe(config.options.length - 1);
    });
    it("should get the correct option", function () {
        expect(model.get(0)).toEqual(model.options[0]);
        expect(model.get(1)).toEqual(model.options[1]);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.options.length).toBe(model.options.length);
        expect(json.value).toBe(model.value);
        expect(json.type).toEqual(dynamic_radio_group_model_1.DYNAMIC_FORM_CONTROL_TYPE_RADIO_GROUP);
    });
});

//# sourceMappingURL=dynamic-radio-group.model.spec.js.map
