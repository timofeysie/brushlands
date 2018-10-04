import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Artwork} from '../../models/artwork';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Artist} from '../../models/artist';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) {
    }

    private getApiUrl(url: string) {
        return environment.backendUrl + url;
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

    public getArtist(name): Observable<Artist> {
        return this.http.get(this.getApiUrl('artist/' + name))
            .pipe(map((response: any) => {
                let artist = new Artist(response.name);
                artist.skinName = response.skinName;
                artist.language = response.language;
                artist.region = response.region;
                artist.dreaming = response.dreaming;
                artist.DOB = response.DOB;
                artist.bio.body = response.bio ? response.bio.body : null;
                artist.bio.title = response.bio ? response.bio.title : null;
                artist.bio.AASDLink = response.bio ? response.bio.AASDLink : null;
                artist.bio.WikiLink = response.bio ? response.bio.WikiLink : null;
                return artist;
            }));
    }

    public saveArtist(artist: Artist): Observable<boolean> {
        return this.http.post<boolean>(this.getApiUrl('artist/' + artist.name), artist)
            .pipe(map((response: any) => {
                if (response.n == 0) {
                    return false;
                }
                return true;
            }));
    }
}
