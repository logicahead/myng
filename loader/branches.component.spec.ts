/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { DebugElement } from '@angular/core';
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from "rxjs/Rx";
import { Branch } from './branch';
import { BranchService } from './branch.service';
import { BranchesComponent } from './branches.component';

let branchServiceStub: any;
let fixture: ComponentFixture<BranchesComponent>;

describe('Branches component', () => {

    let component: BranchesComponent;;

    beforeEach(async(() => {

        branchServiceStub = {
            get(): Observable<Branch[]> {
                return Observable.of([new Branch(1, "branch1"), new Branch(2, "branch2")]);
            }
        };
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                RouterTestingModule
            ],
            declarations: [BranchesComponent],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true },
                { provide: BranchService, useValue: branchServiceStub }
            ]
        });
        fixture = TestBed.createComponent(BranchesComponent);
        component = fixture.componentInstance;
    }));

    it('branches list is initially populated', async () => {
        let branches = component.branches;
        expect(branches.length).toEqual(2);
    });
});


