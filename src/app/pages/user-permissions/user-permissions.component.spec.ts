import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserPermissionsComponent} from './user-permissions.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('UserPermissionsComponent', () => {
    let component: UserPermissionsComponent;
    let fixture: ComponentFixture<UserPermissionsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule],
            declarations: [UserPermissionsComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserPermissionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
