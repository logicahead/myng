"use strict";
var testing_1 = require("@angular/core/testing");
var dynamic_form_autofill_service_1 = require("./dynamic-form-autofill.service");
describe("DynamicFormAutoFillService test suite", function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [dynamic_form_autofill_service_1.DynamicFormAutoFillService]
        });
    });
    beforeEach(testing_1.inject([dynamic_form_autofill_service_1.DynamicFormAutoFillService], function (autoFillService) { return service = autoFillService; }));
    it("should validate autofill expressions correctly", function () {
        var value1 = "section-test shipping mobile tel";
        var value2 = "billing section-test mobile tel";
        var value3 = "section-test shipping tel";
        var value4 = "section-test work given-name";
        var value5 = "billing cc-name";
        var value6 = "home email";
        var value7 = "section-test shipping work";
        var value8 = "section-test work shipping tel";
        var value9 = "billing country";
        var value10 = "billing country name";
        var value11 = "billing shipping name";
        var value12 = "section-test1 section-test2 shipping name";
        var value13 = "section-test1 blabla name";
        var value14 = "section-test1 blabla mobile tel";
        expect(service.validate(value1)).toBe(true);
        expect(service.validate(value2)).toBe(false);
        expect(service.validate(value3)).toBe(false);
        expect(service.validate(value4)).toBe(false);
        expect(service.validate(value5)).toBe(true);
        expect(service.validate(value6)).toBe(true);
        expect(service.validate(value7)).toBe(false);
        expect(service.validate(value8)).toBe(false);
        expect(service.validate(value9)).toBe(true);
        expect(service.validate(value10)).toBe(false);
        expect(service.validate(value11)).toBe(false);
        expect(service.validate(value12)).toBe(false);
        expect(service.validate(value13)).toBe(false);
        expect(service.validate(value14)).toBe(false);
    });
    it("should validate address tokens correctly", function () {
        expect(service.isAddressToken("shipping")).toBe(true);
        expect(service.isAddressToken("billing")).toBe(true);
        expect(service.isAddressToken("home")).toBe(false);
    });
    it("should validate contact tokens correctly", function () {
        expect(service.isContactToken("home")).toBe(true);
        expect(service.isContactToken("work")).toBe(true);
        expect(service.isContactToken("mobile")).toBe(true);
        expect(service.isContactToken("fax")).toBe(true);
        expect(service.isContactToken("pager")).toBe(true);
        expect(service.isContactToken("billing")).toBe(false);
    });
    it("should validate section tokens correctly", function () {
        expect(service.isSectionToken("section-test")).toBe(true);
        expect(service.isSectionToken("section")).toBe(false);
    });
    it("should validate contact fields correctly", function () {
        expect(service.isContactField("tel")).toBe(true);
        expect(service.isContactField("email")).toBe(true);
        expect(service.isContactField("impp")).toBe(true);
        expect(service.isContactField("name")).toBe(false);
        expect(service.isContactField("country")).toBe(false);
    });
    it("should validate fields correctly", function () {
        expect(service.isField("street-address")).toBe(true);
        expect(service.isField("nickname")).toBe(true);
        expect(service.isField("organization")).toBe(true);
        expect(service.isField("postal-code")).toBe(true);
        expect(service.isField("country")).toBe(true);
        expect(service.isField("tel")).toBe(false);
        expect(service.isField("email")).toBe(false);
    });
});

//# sourceMappingURL=dynamic-form-autofill.service.spec.js.map
