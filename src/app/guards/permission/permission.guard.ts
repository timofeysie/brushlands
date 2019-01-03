import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {PermissionService} from 'src/app/services/permission/permission.service';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
    constructor(private permissionService: PermissionService) {}

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        const permission = next.data['permission'] as string;

        return this.permissionService.checkPermission(permission).pipe(
            map((response: boolean) => {
                if (response) {
                    return true;
                }

                alert('Unauthorized');
                return false;
            })
        );
    }
}
