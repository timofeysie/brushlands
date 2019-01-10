import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artwork } from '../../models/artwork';
import { Images } from '../../models/images';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Artist } from '../../models/artist';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient) { }

    private getApiUrl(url: string) {
        return environment.backendUrl + url;
    }

    public artworks(): Observable<Artwork[]> {
        return this.http.get(this.getApiUrl('artworks')).pipe(
            map((response: any) => {
                return response.map(item => {
                    const artwork = new Artwork(item.assetRefNo, item.title, item.artist);
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
            })
        );
    }

    public artwork(id: any): Observable<Artwork> {
        return this.http.get(this.getApiUrl('artwork/' + id)).pipe(
            map((response: any) => {
                const artwork = new Artwork(response.assetRefNo, response.title, response.artist);
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
            })
        );
    }

    public images(): Observable<Images[]> {
        return this.http.get(this.getApiUrl('images')).pipe(
            map((response: any) => {
                return response.map(item => {
                    const image = new Images(item.assetRefNo, item.imageFile);
                    return image;
                });
            })
        );
    }

    public getImage(id): Observable<string> {
        return this.http.get(this.getApiUrl('image/' + id)).pipe(map((response: any) => response.imageFile));
    }

    public artists(): Observable<Artist[]> {
        return this.http.get(this.getApiUrl('artist')).pipe(
            map((response: any) => {
                return response.map(item => {
                    const artist = new Artist(item.name);
                    artist.skinName = item.skinName;
                    artist.language = item.language;
                    artist.region = item.region;
                    artist.dreaming = item.dreaming;
                    artist.DOB = item.DOB;
                    artist.bio.body = item.bio ? item.bio.body : null;
                    artist.bio.title = item.bio ? item.bio.title : null;
                    artist.bio.AASDLink = item.bio ? item.bio.AASDLink : null;
                    artist.bio.WikiLink = item.bio ? item.bio.WikiLink : null;
                    return artist;
                });

            })
        );
    }


    public getArtist(name): Observable<Artist> {
        return this.http.get(this.getApiUrl('artist/' + name)).pipe(
            map((response: any) => {
                const artist = new Artist(response.name);
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
            })
        );
    }

    public saveArtist(artist: Artist): Observable<boolean> {
        return this.http.post<boolean>(this.getApiUrl('artist/' + artist.name), artist).pipe(
            map((response: any) => {
                if (response.n == 0) {
                    return false;
                }
                return true;
            })
        );
    }

    public getPermission(): Observable<any[]> {
        return this.http.get(this.getApiUrl('permissions/all')).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    public savePermission(data): Observable<any[]> {
        return this.http.post(this.getApiUrl('permissions'), data).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    public isAuthorized(array: any): Observable<any> {
        return this.http.post<any>(this.getApiUrl('is-authorized'), array).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    public uploadFile(file): Observable<any> {
        const data = new FormData();
        data.append('file', file);
        return this.http.post(this.getApiUrl('upload'), data, { reportProgress: true, responseType: 'text' }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    public getLastUpdateDate(): Observable<any> {
        return this.http.get(this.getApiUrl('last-update-date')).pipe(
            map((response: any) => {
                return response.value;
            })
        );
    }

    public getInspectedArtworks(): Observable<any> {
        return this.http.get(this.getApiUrl('get-inspected-artworks')).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    public downloadBackup(): Observable<any> {
        return this.http.get(this.getApiUrl('download-backup')).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    public saveFromDb(data): Observable<any> {
        return this.http.post(this.getApiUrl('save-from-db'), data, { reportProgress: true, responseType: 'text' }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    public inspect(): Observable<any>{
        return this.http.get(this.getApiUrl('inspect'), { reportProgress: true, responseType: 'text' }).pipe(
            map((response: any) => {
                return response;
            })
        );
    }

    public additionalArtwordData(data): Observable<any> {
        return this.http.post(this.getApiUrl('add-additional-artwork-data'), data, { reportProgress: true}).pipe(
            map((response: any) => {
                return response;
            })
        );
    }
}
