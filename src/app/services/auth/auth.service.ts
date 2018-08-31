import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import Auth0Lock from 'auth0-lock';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    auth0Options = {
        auth: {
            redirectUrl: environment.auth0.callbackURL,
            responseType: 'token id_token',
            audience: `https://${environment.auth0.domain}/userinfo`,
            params: {
                scope: 'openid profile'
            }
        },
        autoclose: true,
        oidcConformant: true,
    };
    lock = new Auth0Lock(
        environment.auth0.clientId,
        environment.auth0.domain,
        this.auth0Options
    );
    helper = new JwtHelperService();
    
    constructor() {
        this.lock.on('authenticated', (authResult: any) => {
            localStorage.setItem('token', authResult.idToken);
            localStorage.setItem('profile', JSON.stringify(authResult.idTokenPayload));
        });
        this.lock.on('authorization_error', error => {
            console.log('something went wrong', error);
        });
    }

    public login(): void {
        this.lock.show();
    }

    public isAuthenticated(): boolean {
        return !this.helper.isTokenExpired(localStorage.getItem('token'));
    }

    public logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
    }

    public getProfile(): any {
        let profile = JSON.parse(localStorage.getItem('profile'));
        return profile;
    }
}
