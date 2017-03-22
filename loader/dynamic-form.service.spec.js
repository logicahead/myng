"use strict";
var testing_1 = require("@angular/core/testing");
var forms_1 = require("@angular/forms");
var dynamic_form_service_1 = require("./dynamic-form.service");
var dynamic_checkbox_model_1 = require("../model/checkbox/dynamic-checkbox.model");
var dynamic_checkbox_group_model_1 = require("../model/checkbox/dynamic-checkbox-group.model");
var dynamic_form_array_model_1 = require("../model/form-array/dynamic-form-array.model");
var dynamic_form_control_model_1 = require("../model/dynamic-form-control.model");
var dynamic_input_model_1 = require("../model/input/dynamic-input.model");
var dynamic_radio_group_model_1 = require("../model/radio/dynamic-radio-group.model");
var dynamic_select_model_1 = require("../model/select/dynamic-select.model");
var dynamic_slider_model_1 = require("../model/slider/dynamic-slider.model");
var dynamic_switch_model_1 = require("../model/switch/dynamic-switch.model");
var dynamic_textarea_model_1 = require("../model/textarea/dynamic-textarea.model");
var dynamic_form_group_model_1 = require("../model/form-group/dynamic-form-group.model");
describe("DynamicFormService test suite", function () {
    var testModel, service;
    function testValidator() {
        return {
            testValidator: {
                valid: true
            }
        };
    }
    function testAsyncValidator() {
        return new Promise(function (resolve) { return setTimeout(function () { return resolve(true); }, 0); });
    }
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [forms_1.ReactiveFormsModule],
            providers: [
                dynamic_form_service_1.DynamicFormService,
                { provide: forms_1.NG_VALIDATORS, useValue: testValidator, multi: true },
                { provide: forms_1.NG_ASYNC_VALIDATORS, useValue: testAsyncValidator, multi: true }
            ]
        });
        testModel = [
            new dynamic_select_model_1.DynamicSelectModel({
                id: "testSelect",
                options: [
                    {
                        label: "Option 1",
                        value: "option-1",
                    },
                    {
                        label: "Option 2",
                        value: "option-2"
                    }
                ],
                value: "option-3"
            }),
            new dynamic_input_model_1.DynamicInputModel({ id: "testInput", }),
            new dynamic_checkbox_group_model_1.DynamicCheckboxGroupModel({
                id: "testCheckboxGroup",
                group: [
                    new dynamic_checkbox_model_1.DynamicCheckboxModel({
                        id: "testCheckboxGroup1",
                        value: true
                    }),
                    new dynamic_checkbox_model_1.DynamicCheckboxModel({
                        id: "testCheckboxGroup2",
                        value: true
                    })
                ]
            }),
            new dynamic_radio_group_model_1.DynamicRadioGroupModel({
                id: "testRadioGroup",
                options: [
                    {
                        label: "Option 1",
                        value: "option-1",
                    },
                    {
                        label: "Option 2",
                        value: "option-2"
                    }
                ],
                value: "option-3"
            }),
            new dynamic_textarea_model_1.DynamicTextAreaModel({ id: "testTextArea" }),
            new dynamic_checkbox_model_1.DynamicCheckboxModel({ id: "testCheckbox" }),
            new dynamic_form_array_model_1.DynamicFormArrayModel({
                id: "testFormArray",
                initialCount: 5,
                createGroup: function () {
                    return [
                        new dynamic_input_model_1.DynamicInputModel({ id: "basicArrayGroupInput" })
                    ];
                }
            }),
            new dynamic_form_group_model_1.DynamicFormGroupModel({ id: "testFormGroup", group: [] }),
            new dynamic_slider_model_1.DynamicSliderModel({ id: "testSlider" }),
            new dynamic_switch_model_1.DynamicSwitchModel({ id: "testSwitch" })
        ];
    });
    beforeEach(testing_1.inject([dynamic_form_service_1.DynamicFormService], function (dynamicFormService) { return service = dynamicFormService; }));
    it("should be defined", function () {
        expect(service).toBeDefined();
    });
    it("should create create a form group correctly", function () {
        expect(service.createFormGroup).toBeDefined();
        var result = service.createFormGroup(testModel);
        expect(result instanceof forms_1.FormGroup).toBe(true);
        expect(result.get("testCheckbox") instanceof forms_1.FormControl).toBe(true);
        expect(result.get("testCheckboxGroup") instanceof forms_1.FormGroup).toBe(true);
        expect(result.get("testFormArray") instanceof forms_1.FormArray).toBe(true);
        expect(result.get("testInput") instanceof forms_1.FormControl).toBe(true);
        expect(result.get("testRadioGroup") instanceof forms_1.FormControl).toBe(true);
        expect(result.get("testSelect") instanceof forms_1.FormControl).toBe(true);
        expect(result.get("testTextArea") instanceof forms_1.FormControl).toBe(true);
    });
    it("should parse dynamic form JSON correctly", function () {
        var json = JSON.parse(JSON.stringify(testModel)), formModel;
        expect(service.fromJSON).toBeDefined();
        formModel = service.fromJSON(json);
        expect(Array.isArray(formModel)).toBe(true);
        expect(formModel[0] instanceof dynamic_select_model_1.DynamicSelectModel).toBe(true);
        expect(formModel[1] instanceof dynamic_input_model_1.DynamicInputModel).toBe(true);
        expect(formModel[2] instanceof dynamic_checkbox_group_model_1.DynamicCheckboxGroupModel).toBe(true);
        expect(formModel[2]["group"].length).toBe(testModel[2].group.length);
        expect(formModel[3] instanceof dynamic_radio_group_model_1.DynamicRadioGroupModel).toBe(true);
        expect(formModel[4] instanceof dynamic_textarea_model_1.DynamicTextAreaModel).toBe(true);
        expect(formModel[5] instanceof dynamic_checkbox_model_1.DynamicCheckboxModel).toBe(true);
        expect(formModel[6] instanceof dynamic_form_array_model_1.DynamicFormArrayModel).toBe(true);
        expect(formModel[7] instanceof dynamic_form_group_model_1.DynamicFormGroupModel).toBe(true);
        expect(formModel[8] instanceof dynamic_slider_model_1.DynamicSliderModel).toBe(true);
        expect(formModel[9] instanceof dynamic_switch_model_1.DynamicSwitchModel).toBe(true);
    });
    it("should throw when unknown DynamicFormControlModel id is specified in JSON", function () {
        expect(function () { return service.fromJSON([{ id: "test" }]); })
            .toThrow(new Error("unknown form control type with id \"test\" defined on JSON object"));
    });
    it("should find a dynamic form control model by id correctly", function () {
        expect(service.findById).toBeDefined();
        expect(service.findById("testCheckbox", testModel) instanceof dynamic_form_control_model_1.DynamicFormControlModel).toBe(true);
        expect(service.findById("testCheckboxGroup", testModel) instanceof dynamic_form_control_model_1.DynamicFormControlModel).toBe(true);
        expect(service.findById("testFormArray", testModel) instanceof dynamic_form_control_model_1.DynamicFormControlModel).toBe(true);
        expect(service.findById("testInput", testModel) instanceof dynamic_form_control_model_1.DynamicFormControlModel).toBe(true);
        expect(service.findById("testRadioGroup", testModel) instanceof dynamic_form_control_model_1.DynamicFormControlModel).toBe(true);
        expect(service.findById("testSelect", testModel) instanceof dynamic_form_control_model_1.DynamicFormControlModel).toBe(true);
        expect(service.findById("testSlider", testModel) instanceof dynamic_form_control_model_1.DynamicFormControlModel).toBe(true);
        expect(service.findById("testSwitch", testModel) instanceof dynamic_form_control_model_1.DynamicFormControlModel).toBe(true);
        expect(service.findById("testTextArea", testModel) instanceof dynamic_form_control_model_1.DynamicFormControlModel).toBe(true);
    });
    it("should create a form array correctly", function () {
        var model = service.findById("testFormArray", testModel), formArray;
        expect(service.createFormArray).toBeDefined();
        formArray = service.createFormArray(model);
        expect(formArray instanceof forms_1.FormArray).toBe(true);
        expect(formArray.length).toBe(model.initialCount);
    });
    it("should create a form array group correctly", function () {
        var model = service.findById("testFormArray", testModel);
        expect(service.createFormArrayGroup).toBeDefined();
        expect(service.createFormArrayGroup(model) instanceof forms_1.FormGroup).toBe(true);
    });
    it("should add a form array group correctly", function () {
        var model = service.findById("testFormArray", testModel), formArray = service.createFormArray(model);
        expect(service.addFormArrayGroup).toBeDefined();
        service.addFormArrayGroup(formArray, model);
        expect(formArray.length).toBe(model.initialCount + 1);
    });
    it("should insert a form array group correctly", function () {
        var model = service.findById("testFormArray", testModel), formArray = service.createFormArray(model);
        expect(service.insertFormArrayGroup).toBeDefined();
        service.insertFormArrayGroup(0, formArray, model);
        expect(formArray.length).toBe(model.initialCount + 1);
    });
    it("should remove a form array group correctly", function () {
        var model = service.findById("testFormArray", testModel), formArray = service.createFormArray(model);
        expect(service.removeFormArrayGroup).toBeDefined();
        service.removeFormArrayGroup(0, formArray, model);
        expect(formArray.length).toBe(model.initialCount - 1);
    });
    it("should clear a form array correctly", function () {
        var model = service.findById("testFormArray", testModel), formArray = service.createFormArray(model);
        expect(service.clearFormArray).toBeDefined();
        service.clearFormArray(formArray, model);
        expect(formArray.length).toBe(0);
    });
    it("should resolve validators from config correctly", function () {
        var config = { required: null, maxLength: 7, minLength: 3 }, validators = service.getValidators(config);
        expect(validators.length).toBe(Object.keys(config).length);
    });
    it("should resolve custom validators from config correctly", function () {
        var config = { required: null, maxLength: 7, testValidator: null }, validators = service.getValidators(config);
        expect(validators.length).toBe(Object.keys(config).length);
    });
    it("should resolve custom async validators from config correctly", function () {
        var config = { required: null, maxLength: 7, testAsyncValidator: null }, validators = service.getValidators(config);
        expect(validators.length).toBe(Object.keys(config).length);
    });
    it("should throw when validator is not provided via NG_VALIDATORS or NG_ASYNC_VALIDATORS", function () {
        expect(function () { return service.getValidatorFn("test", null); })
            .toThrow(new Error("validator \"test\" is not provided via NG_VALIDATORS or NG_ASYNC_VALIDATORS"));
    });
});

//# sourceMappingURL=dynamic-form.service.spec.js.map
