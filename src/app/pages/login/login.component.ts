import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(public auth: AuthService) {
    }

    ngOnInit() {
    }

    login() {
        this.auth.login();
    }

    logout() {
        this.auth.logout();
    }
}
