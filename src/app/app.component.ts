import {Component} from '@angular/core';
import {AuthService} from './services/auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'brushlands';
    auth: AuthService;

    constructor(authService: AuthService) {
        this.auth = authService;
    }
}
