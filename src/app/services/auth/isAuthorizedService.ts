import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '../../services/api/api.service';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IsAuthorizedService {

    constructor(public apiService: ApiService) {

    }

    public checkAuth(task: string): Observable<any> {

        let sampleArray = new FormData();
        let loggedUser = localStorage.getItem('profile');
        let currentUserEmail = null;
        if (loggedUser) {
            currentUserEmail = JSON.parse(loggedUser).name;
        }

        sampleArray.append('fetched_data', JSON.stringify({email: currentUserEmail, task: task}));
        return this.apiService.isAuthorized(sampleArray).pipe(map((response: any) => {
            return response;
        }));

    }
}
