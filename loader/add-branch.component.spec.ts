/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { DebugElement } from '@angular/core';
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser'
import { Observable } from "rxjs/Rx";
import { Router } from '@angular/router';
import { Branch } from './branch';
import { BranchService } from './branch.service';
import { AddBranchComponent } from './add-branch.component';
import { FormHelpers } from '../../helpers/formHelpers';

let branchServiceStub: any;
let mockRouter: any;
let fixture: ComponentFixture<AddBranchComponent>;

describe('Add Branch component', () => {

    let component: AddBranchComponent;;

    beforeEach(async(() => {

        mockRouter = {
            navigate: jasmine.createSpy('navigate')
        }

        branchServiceStub = {
            add(branch: Branch): Observable<Branch> {
                return Observable.of(new Branch(1, "branch1"));
            }
        };
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule
            ],
            declarations: [AddBranchComponent],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: BranchService, useValue: branchServiceStub },
                { provide: Router, useValue: mockRouter },
                FormBuilder,
                FormHelpers
            ]
        });
        fixture = TestBed.createComponent(AddBranchComponent);
        component = fixture.componentInstance;
    }));

    it('add branch form invalid when empty', async () => {
        expect(component.addBranchForm.valid).toBeFalsy();
    });

    it('name field is initially invalid', async () => {
        let name = component.addBranchForm.controls['name'];
        expect(name.valid).toBeFalsy();
    });

    it('name field invalid when empty', async () => {
        let errors = {};
        let name = component.addBranchForm.controls['name'];
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();
    });

    it('name field valid when not empty', async () => {
        let errors = {};
        let name = component.addBranchForm.controls['name'];
        name.setValue('branch1');
        errors = name.errors || {};
        expect(errors).toEqual({});
    });

    it('submitting the add branch form navigates to branches page', () => {
        expect(component.addBranchForm.valid).toBeFalsy();
        component.addBranchForm.controls['name'].setValue("org1");
        expect(component.addBranchForm.valid).toBeTruthy();

        let branch: Branch;

        component.onSubmit();

        expect(mockRouter.navigate).toHaveBeenCalledWith(['/branches']);
    });
});


