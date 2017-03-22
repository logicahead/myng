"use strict";
var testing_1 = require("@angular/core/testing");
var forms_1 = require("@angular/forms");
var dynamic_form_relation_service_1 = require("./dynamic-form-relation.service");
var dynamic_form_service_1 = require("./dynamic-form.service");
var dynamic_radio_group_model_1 = require("../model/radio/dynamic-radio-group.model");
var dynamic_select_model_1 = require("../model/select/dynamic-select.model");
var dynamic_textarea_model_1 = require("../model/textarea/dynamic-textarea.model");
describe("DynamicFormRelationService test suite", function () {
    var service, controlGroup, model = new dynamic_textarea_model_1.DynamicTextAreaModel({ id: "testTextArea" }), rel1 = {
        action: "DISABLE",
        connective: "OR",
        when: [
            {
                id: "testSelect",
                value: "option-2"
            },
            {
                id: "testRadioGroup",
                value: "option-3"
            }
        ]
    }, rel2 = {
        action: "ENABLE",
        connective: "AND",
        when: [
            {
                id: "testSelect",
                value: "option-3"
            },
            {
                id: "testRadioGroup",
                value: "option-2",
            }
        ]
    }, rel3 = {
        action: "DISABLE",
        connective: "AND",
        when: [
            {
                id: "testSelect",
                value: "option-2"
            },
            {
                id: "testRadioGroup",
                value: "option-3"
            }
        ]
    }, rel4 = {
        action: "ENABLE",
        connective: "OR",
        when: [
            {
                id: "testSelect",
                value: "option-1"
            },
            {
                id: "testRadioGroup",
                value: "option-2",
            }
        ]
    }, rel5 = {
        action: "DISABLE",
        connective: "OR",
        when: [
            {
                id: "testSelect",
                value: "option-1"
            },
            {
                id: "testRadioGroup",
                value: "option-3"
            }
        ]
    };
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [forms_1.ReactiveFormsModule],
            providers: [dynamic_form_relation_service_1.DynamicFormRelationService, dynamic_form_service_1.DynamicFormService]
        });
    });
    beforeEach(testing_1.inject([dynamic_form_relation_service_1.DynamicFormRelationService, dynamic_form_service_1.DynamicFormService], function (relationService, formService) {
        service = relationService;
        controlGroup = formService.createFormGroup([
            new dynamic_select_model_1.DynamicSelectModel({
                id: "testSelect",
                options: [{ value: "option-1" }, { value: "option-2" }, { value: "option-3" }],
                value: "option-1"
            }),
            new dynamic_radio_group_model_1.DynamicRadioGroupModel({
                id: "testRadioGroup",
                options: [{ value: "option-1" }, { value: "option-2" }, { value: "option-3" }],
                value: "option-1"
            }),
            model
        ]);
    }));
    it("should find an activation relation correctly", function () {
        model.relation = [rel1];
        expect(service.findActivationRelation(model.relation)).toBe(rel1);
        model.relation = [rel2];
        expect(service.findActivationRelation(model.relation)).toBe(rel2);
    });
    it("should get all related form controls correctly", function () {
        model.relation = [rel2];
        expect(service.getRelatedFormControls(model, controlGroup).length).toBe(2);
    });
    it("should throw when model depends on itself", function () {
        model.relation = [{
                action: "DISABLE",
                when: [
                    {
                        id: "testTextArea",
                        value: "test"
                    }
                ]
            }];
        expect(function () { return service.getRelatedFormControls(model, controlGroup); })
            .toThrow(new Error("FormControl " + model.id + " cannot depend on itself"));
    });
    it("should check if form control is to be disabled correctly", function () {
        model.relation = [rel1];
        expect(service.isFormControlToBeDisabled(model.relation[0], controlGroup)).toBe(false);
        model.relation = [rel2];
        expect(service.isFormControlToBeDisabled(model.relation[0], controlGroup)).toBe(true);
        model.relation = [rel3];
        expect(service.isFormControlToBeDisabled(model.relation[0], controlGroup)).toBe(false);
        model.relation = [rel4];
        expect(service.isFormControlToBeDisabled(model.relation[0], controlGroup)).toBe(false);
        model.relation = [rel5];
        expect(service.isFormControlToBeDisabled(model.relation[0], controlGroup)).toBe(true);
        model.relation = [{ action: "TEST", when: [{ id: "testTextArea", value: "test" }] }];
        expect(service.isFormControlToBeDisabled(model.relation[0], controlGroup)).toBe(false);
    });
});

//# sourceMappingURL=dynamic-form-relation.service.spec.js.map
