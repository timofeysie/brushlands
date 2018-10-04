import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ExternalLinkService {

    constructor(private http: HttpClient) {
    }

    checkAASDLink(link: string): Observable<boolean> {
        return this.http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20htmlstring%20where%20url%3D%22' + link + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
            .pipe(map((response: any) => {
                if (response.query.results) {
                    return true;
                }
                return false;
            }));
    }

    checkWikiLink(link: string): Observable<boolean> {
        return this.http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20htmlstring%20where%20url%3D%22' + link + '%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
            .pipe(map((response: any) => {
                if (response.query.results) {
                    return true;
                }
                return false;
            }));
    }

}
