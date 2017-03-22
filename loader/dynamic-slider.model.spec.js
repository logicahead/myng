"use strict";
var dynamic_slider_model_1 = require("./dynamic-slider.model");
describe("DynamicSliderModel test suite", function () {
    var model, config = {
        id: "slider",
        min: 0,
        max: 100,
        step: 1,
        value: 27
    };
    beforeEach(function () { return model = new dynamic_slider_model_1.DynamicSliderModel(config); });
    it("should initialize correctly", function () {
        expect(model.disabled).toBe(false);
        expect(model.id).toEqual(config.id);
        expect(model.label).toBeNull();
        expect(model.min).toBe(config.min);
        expect(model.max).toBe(config.max);
        expect(model.name).toEqual(model.id);
        expect(model.step).toBe(config.step);
        expect(model.type).toEqual(dynamic_slider_model_1.DYNAMIC_FORM_CONTROL_TYPE_SLIDER);
        expect(model.value).toBe(config.value);
        expect(model.vertical).toBe(false);
    });
    it("should serialize correctly", function () {
        var json = JSON.parse(JSON.stringify(model));
        expect(json.id).toEqual(model.id);
        expect(json.value).toBe(model.value);
        expect(json.type).toEqual(dynamic_slider_model_1.DYNAMIC_FORM_CONTROL_TYPE_SLIDER);
    });
});

//# sourceMappingURL=dynamic-slider.model.spec.js.map
