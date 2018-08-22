import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Artwork} from '../../models/artwork';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private  http: HttpClient) {
    }

    public artworks(): Observable<Artwork[]> {
        return this.http.get('http://localhost:3000/api/artworks')
            .pipe(map((response: any) => {
                return response.map((item) => {
                    return new Artwork(item.assetRefNo, item.title, item.artist);
                });
            }));
    }
}
