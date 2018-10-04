import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {FormGroup} from '@angular/forms';

@Component({
    selector: 'app-user-permissions',
    templateUrl: './user-permissions.component.html',
    styleUrls: ['./user-permissions.component.scss']
})
export class UserPermissionsComponent implements OnInit {
    permissions: any[];
    users: string[] = [];
    permissionForm: FormGroup;

    constructor(private apiService: ApiService) {
        this.permissionForm = new FormGroup({

        });
    }

    ngOnInit() {
        this.apiService.getPermission().subscribe((response: any[]) => {
            this.permissions = response;

            response.forEach(item => {
                this.users = this.users.concat(item.users);
            });

            this.users = this.users.filter((item, pos) => {
                return this.users.indexOf(item) == pos;
            });

            console.log(this.users);
        });
    }
}
