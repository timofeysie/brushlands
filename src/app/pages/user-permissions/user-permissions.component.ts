import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-user-permissions',
    templateUrl: './user-permissions.component.html',
    styleUrls: ['./user-permissions.component.scss']
})
export class UserPermissionsComponent implements OnInit {
    permissions: { user: string; permissions: string[] }[];
    permissionForm: FormGroup;
    selectedUser: any;
    showPermissions: boolean;

    constructor(private apiService: ApiService) {
        this.permissionForm = new FormGroup({
            user: new FormControl('', Validators.required),
            manageUserPermissions: new FormControl(''),
            viewLocationInsuredAndProvenance: new FormControl(''),
            uploadAndBackupArtworks: new FormControl('')
        });
    }

    ngOnInit() {
        this.showPermissions = false;
        this.apiService.getPermission().subscribe((response: any[]) => {
            this.permissions = response;
        });

        this.permissionForm.get('user').valueChanges.subscribe(value => {
            this.showPermissions = true;
            this.permissionForm.patchValue({
                manageUserPermissions: this.inArray(value.permissions, 'manage-user-permissions'),
                viewLocationInsuredAndProvenance: this.inArray(
                    value.permissions,
                    'view-location-insured-and-provenance'
                ),
                uploadAndBackupArtworks: this.inArray(value.permissions, 'upload-and-backup-artworks')
            });
        });
    }

    savePermissions() {
        const values = this.permissionForm.value;

        const data = {
            user: values.user.user,
            permissions: []
        };

        if (values.manageUserPermissions) {
            data.permissions.push('manage-user-permissions');
        }
        if (values.viewLocationInsuredAndProvenance) {
            data.permissions.push('view-location-insured-and-provenance');
        }
        if (values.uploadAndBackupArtworks) {
            data.permissions.push('upload-and-backup-artworks');
        }

        this.apiService.savePermission(data).subscribe((response: any) => {
            if (response.ok) {
                const index = this.permissions.findIndex(item => {
                    return item.user == data.user;
                });

                if (index != -1) {
                    this.permissions[index].permissions = data.permissions;
                }
            }
        });
    }

    private inArray(array: string[], key: string) {
        return array.indexOf(key) !== -1;
    }
}
