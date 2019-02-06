import { TestBed, async, inject } from '@angular/core/testing';
import { PermissionGuard } from './permission.guard';

describe('PermissionGuard', () => {
    let guard: PermissionGuard;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
        providers: [PermissionGuard]
        });
        guard = TestBed.get(PermissionGuard);
    }));

    it('should ...', inject([PermissionGuard], (guard: PermissionGuard) => {
        expect(guard).toBeTruthy();
    }));
});
