"use strict";
var dynamic_switch_model_1 = require("./dynamic-switch.model");
describe("DynamicSwitchModel test suite", function () {
    var model, config = {
        id: "switch"
    };
    beforeEach(function () { return model = new dynamic_switch_model_1.DynamicSwitchModel(config); });
    it("should initialize correctly", function () {
        expect(model.disabled).toBe(false);
        expect(model.id).toEqual(config.id);
        expect(model.label).toBeNull();
        expect(model.offLabel).toBeNull();
        expect(model.onLabel).toBeNull();
        expect(model.name).toEqual(model.id);
        expect(model.type).toEqual(dynamic_switch_model_1.DYNAMIC_FORM_CONTROL_TYPE_SWITCH);
        expect(model.value).toBe(false);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.value).toBe(model.value);
        expect(json.type).toEqual(dynamic_switch_model_1.DYNAMIC_FORM_CONTROL_TYPE_SWITCH);
    });
});

//# sourceMappingURL=dynamic-switch.model.spec.js.map
