import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {AuthService} from '../../services/auth/auth.service';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: Partial<AuthService>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated', 'logout', 'getProfile']);
        TestBed.configureTestingModule({
            declarations: [LoginComponent],
            providers: [{provide: AuthService, useValue: authServiceSpy}]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        authService = fixture.debugElement.injector.get(AuthService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('login function should call auth service login one time', () => {
        component.login();
        expect(authServiceSpy.login.calls.count()).toBe(1);
    });

    it('logout function should call AuthService logout one time', () => {
        component.logout();
        expect(authServiceSpy.logout.calls.count()).toBe(1);
    });

    it('should show sign in button if not authenticated', () => {
        authServiceSpy.isAuthenticated.and.returnValue(false);
        fixture.detectChanges();

        const host: HTMLElement = fixture.nativeElement;
        const loginButton: HTMLElement = host.querySelector('#login-btn');
        expect(loginButton).not.toBeNull('sign in button exists');
        expect(loginButton.textContent).toContain('Sign In', 'text on sign button');
    });

    it('should show sign out button and  profile information if authenticated', () => {
        const profile = {
            nickname: 'test',
            updated_at: '2018-08-16',
            name: 'test@test.com'
        };

        authServiceSpy.isAuthenticated.and.returnValue(true);
        authServiceSpy.getProfile.and.returnValue(profile);
        fixture.detectChanges();

        const host: HTMLElement = fixture.nativeElement;
        const logoutBtn: HTMLElement = host.querySelector('#logout-btn');

        expect(logoutBtn).not.toBeNull('sign out button exists');
        expect(logoutBtn.textContent).toContain('Sign Out');

        expect(host.textContent).toContain('test', 'nickname shows');
        expect(host.textContent).toContain('2018-08-16', 'update date shows');
        expect(host.textContent).toContain('test@test.com', 'name shows');
    });
});
