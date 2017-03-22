/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { DebugElement } from '@angular/core';
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser'
import { Observable } from "rxjs/Rx";
import { Router } from '@angular/router';
import { Employee } from './employee';
import { EmployeeService } from './employee.service';
import { AddEmployeeComponent } from './add-employee.component';
import { FormHelpers } from '../../helpers/formHelpers';

let employeeServiceStub: any;
let mockRouter: any;
let fixture: ComponentFixture<AddEmployeeComponent>;

describe('Add Branch component', () => {

    let component: AddEmployeeComponent;;

    beforeEach(async(() => {

        mockRouter = {
            navigate: jasmine.createSpy('navigate')
        }

        employeeServiceStub = {
            add(employee: Employee): Observable<Employee> {
                return Observable.of(new Employee(1, 'dan', 'oleary', "dev", 40));
            }
        };
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule
            ],
            declarations: [AddEmployeeComponent],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: EmployeeService, useValue: employeeServiceStub },
                { provide: Router, useValue: mockRouter },
                FormBuilder,
                FormHelpers
            ]
        });
        fixture = TestBed.createComponent(AddEmployeeComponent);
        component = fixture.componentInstance;
    }));

    it('add employee form invalid when empty', async () => {
        expect(component.addEmployeeForm.valid).toBeFalsy();
    });

    it('first name field is initially invalid', async () => {
        let name = component.addEmployeeForm.controls['firstName'];
        expect(name.valid).toBeFalsy();
    });

    it('last name field is initially invalid', async () => {
        let name = component.addEmployeeForm.controls['lastName'];
        expect(name.valid).toBeFalsy();
    });

    it('job title field is initially invalid', async () => {
        let name = component.addEmployeeForm.controls['jobTitle'];
        expect(name.valid).toBeFalsy();
    });

    it('contracted hours field is initially invalid', async () => {
        let name = component.addEmployeeForm.controls['contractedHours'];
        expect(name.valid).toBeFalsy();
    });

    it('first name field invalid when empty', async () => {
        let errors = {};
        let name = component.addEmployeeForm.controls['firstName'];
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();
    });

    it('last name field invalid when empty', async () => {
        let errors = {};
        let name = component.addEmployeeForm.controls['lastName'];
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();
    });

    it('job title field invalid when empty', async () => {
        let errors = {};
        let name = component.addEmployeeForm.controls['jobTitle'];
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();
    });

    it('contracted hours field invalid when empty', async () => {
        let errors = {};
        let name = component.addEmployeeForm.controls['contractedHours'];
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();
    });

    it('first name field valid when not empty', async () => {
        let errors = {};
        let name = component.addEmployeeForm.controls['firstName'];
        name.setValue('dan');
        errors = name.errors || {};
        expect(errors).toEqual({});
    });

    it('last name field valid when not empty', async () => {
        let errors = {};
        let name = component.addEmployeeForm.controls['lastName'];
        name.setValue('oleary');
        errors = name.errors || {};
        expect(errors).toEqual({});
    });

    it('job title field valid when not empty', async () => {
        let errors = {};
        let name = component.addEmployeeForm.controls['jobTitle'];
        name.setValue('dev');
        errors = name.errors || {};
        expect(errors).toEqual({});
    });

    it('contracted hours field valid when not empty', async () => {
        let errors = {};
        let name = component.addEmployeeForm.controls['contractedHours'];
        name.setValue(40);
        errors = name.errors || {};
        expect(errors).toEqual({});
    });

    it('submitting the add employee form navigates to employees page', () => {
        expect(component.addEmployeeForm.valid).toBeFalsy();
        component.addEmployeeForm.controls['firstName'].setValue('dan');
        component.addEmployeeForm.controls['lastName'].setValue('oleary');
        component.addEmployeeForm.controls['jobTitle'].setValue('dev');
        component.addEmployeeForm.controls['contractedHours'].setValue(40);
        expect(component.addEmployeeForm.valid).toBeTruthy();

        component.onSubmit();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/employees']);
    });
});


