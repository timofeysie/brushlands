import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map, catchError} from 'rxjs/operators';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    constructor(private http: HttpClient, private authService: AuthService) {}

    checkPermission(permission: string): Observable<boolean> {
        const authUser = this.authService.getProfile();

        let params = new HttpParams();
        params = params.append('user', authUser.name);
        params = params.append('permission', permission);

        return this.http.get(`${environment.backendUrl}check-permission`, {params: params}).pipe(
            map((response: any) => {
                return true;
            }),
            catchError((err: HttpErrorResponse) => {
                return of(false);
            })
        );
    }
}
