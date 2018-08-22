import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Artwork} from '../../models/artwork';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    constructor(private  http: HttpClient) {
    }

    private getApiUrl(url: string) {
        return 'http://localhost:3000/api/' + url;
    }

    public artworks(): Observable<Artwork[]> {
        return this.http.get(this.getApiUrl('artworks'))
                   .pipe(map((response: any) => {
                       return response.map((item) => {
                           let artwork = new Artwork(item.assetRefNo, item.title, item.artist);
                           artwork.inspected = item.inspected;
                           artwork.amountPaid = item.amountPaid;
                           artwork.imageFileName = item.imageFileName;
                           artwork.insured = item.insured;
                           artwork.next = item.next;
                           artwork.officeLocation = item.officeLocation;
                           artwork.previous = item.previous;
                           artwork.provenance = item.provenance;
                           artwork.size = item.size;
                           artwork.text = item.text;
                           artwork.thumbnail = item.thumbnail;
                           return artwork;
                       });
                   }));
    }

    public artwork(id: any): Observable<Artwork> {
        return this.http.get(this.getApiUrl('artwork/' + id))
                   .pipe(map((response: any) => {
                       let artwork = new Artwork(response.assetRefNo, response.title, response.artist);
                       artwork.inspected = response.inspected;
                       artwork.amountPaid = response.amountPaid;
                       artwork.imageFileName = response.imageFileName;
                       artwork.insured = response.insured;
                       artwork.next = response.next;
                       artwork.officeLocation = response.officeLocation;
                       artwork.previous = response.previous;
                       artwork.provenance = response.provenance;
                       artwork.size = response.size;
                       artwork.text = response.text;
                       artwork.thumbnail = response.thumbnail;
                       return artwork;
                   }));
    }

    public getImage(id): Observable<string> {
        return this.http.get(this.getApiUrl('image/' + id))
                   .pipe(map((response: any) => response.imageFile));
    }
}
