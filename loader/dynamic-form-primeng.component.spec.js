"use strict";
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var core_2 = require("@ng2-dynamic-forms/core");
var checkbox_1 = require("primeng/components/checkbox/checkbox");
var dropdown_1 = require("primeng/components/dropdown/dropdown");
var inputswitch_1 = require("primeng/components/inputswitch/inputswitch");
var inputtext_1 = require("primeng/components/inputtext/inputtext");
var inputtextarea_1 = require("primeng/components/inputtextarea/inputtextarea");
var multiselect_1 = require("primeng/components/multiselect/multiselect");
var radiobutton_1 = require("primeng/components/radiobutton/radiobutton");
var slider_1 = require("primeng/components/slider/slider");
var spinner_1 = require("primeng/components/spinner/spinner");
var dynamic_form_primeng_component_1 = require("./dynamic-form-primeng.component");
describe("DynamicFormPrimeNGComponent test suite", function () {
    var inputModel = new core_2.DynamicInputModel({ id: "test" }), formModel = [inputModel], formGroup, fixture, component, debugElement, inputElement;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [
                forms_1.ReactiveFormsModule,
                core_2.DynamicFormsCoreModule.forRoot(),
                checkbox_1.CheckboxModule,
                dropdown_1.DropdownModule,
                inputswitch_1.InputSwitchModule,
                inputtext_1.InputTextModule,
                inputtextarea_1.InputTextareaModule,
                multiselect_1.MultiSelectModule,
                radiobutton_1.RadioButtonModule,
                slider_1.SliderModule,
                spinner_1.SpinnerModule
            ],
            declarations: [dynamic_form_primeng_component_1.DynamicFormPrimeNGComponent]
        }).compileComponents().then(function () {
            fixture = testing_1.TestBed.createComponent(dynamic_form_primeng_component_1.DynamicFormPrimeNGComponent);
            component = fixture.componentInstance;
            debugElement = fixture.debugElement;
        });
    }));
    beforeEach(testing_1.inject([core_2.DynamicFormService], function (service) {
        formGroup = service.createFormGroup(formModel);
        component.controlGroup = formGroup;
        component.model = formModel[0];
        fixture.detectChanges();
        inputElement = debugElement.query(platform_browser_1.By.css("input[id='" + formModel[0].id + "']"));
    }));
    it("should initialize correctly", function () {
        expect(component.type).toEqual(dynamic_form_primeng_component_1.DYNAMIC_FORM_UI_PRIME_NG);
        expect(component.control instanceof forms_1.FormControl).toBe(true);
        expect(component.controlGroup instanceof forms_1.FormGroup).toBe(true);
        expect(component.model instanceof core_2.DynamicFormControlModel).toBe(true);
        expect(component.hasErrorMessaging).toBe(false);
        expect(component.onControlValueChanges).toBeDefined();
        expect(component.onModelDisabledUpdates).toBeDefined();
        expect(component.onModelValueUpdates).toBeDefined();
        expect(component.blur).toBeDefined();
        expect(component.change).toBeDefined();
        expect(component.focus).toBeDefined();
        expect(component.onValueChange).toBeDefined();
        expect(component.onFocusChange).toBeDefined();
        expect(component.isValid).toBe(true);
        expect(component.isInvalid).toBe(false);
    });
    it("should have an input element", function () {
        expect(inputElement instanceof core_1.DebugElement).toBe(true);
    });
    it("should listen to native focus and blur events", function () {
        spyOn(component, "onFocusChange");
        inputElement.triggerEventHandler("focus", null);
        inputElement.triggerEventHandler("blur", null);
        expect(component.onFocusChange).toHaveBeenCalledTimes(2);
    });
    it("should listen to native change event", function () {
        spyOn(component, "onValueChange");
        inputElement.triggerEventHandler("change", null);
        expect(component.onValueChange).toHaveBeenCalled();
    });
    it("should update model value when control value changes", function () {
        spyOn(component, "onControlValueChanges");
        component.ngOnInit();
        component.control.setValue("test");
        expect(component.onControlValueChanges).toHaveBeenCalled();
    });
    it("should update control value when model value changes", function () {
        spyOn(component, "onModelValueUpdates");
        component.ngOnInit();
        inputModel.valueUpdates.next("test");
        expect(component.onModelValueUpdates).toHaveBeenCalled();
    });
    it("should update control activation when model disabled property changes", function () {
        spyOn(component, "onModelDisabledUpdates");
        component.ngOnInit();
        inputModel.disabledUpdates.next(true);
        expect(component.onModelDisabledUpdates).toHaveBeenCalled();
    });
});

//# sourceMappingURL=dynamic-form-primeng.component.spec.js.map
