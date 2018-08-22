import {TestBed, async, inject} from '@angular/core/testing';

import {AuthGuard} from './auth.guard';
import {Router} from '@angular/router';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let routerSpy: jasmine.SpyObj<Router>;
    beforeEach(() => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [AuthGuard, {provide: Router, useValue: routerSpy}],
        });
        guard = TestBed.get(AuthGuard);
    });

    it('should ...', () => {
        expect(guard).toBeTruthy();
    });
});
