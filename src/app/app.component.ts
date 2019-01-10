import {Component} from '@angular/core';
import {AuthService} from './services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'brushlands';
    auth: AuthService;

    constructor(
        authService: AuthService,
        private router: Router,
        ) {
        this.auth = authService;
    }

    logout(){
        localStorage.clear();
        this.router.navigate(['login']);
    }
}
