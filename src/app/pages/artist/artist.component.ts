import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {Artist} from '../../models/artist';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap, map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {ExternalLinkService} from '../../services/external-link/external-link.service';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.scss']
})
export class ArtistComponent implements OnInit {

    artist: Artist;
    editModel: Artist;
    loading: boolean;
    editMode: boolean;
    AASDLink: string;
    AASDLinkLoader: boolean;
    isAASDLinkFound: boolean;
    wikiLink: string;
    wikiLinkLoader: boolean;
    isWikiLinkFound: boolean;
    msg: string;

    constructor(private apiService: ApiService,
        private externalLinkService: ExternalLinkService,
        private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.loading = true;
        this.wikiLinkLoader = true;
        this.AASDLinkLoader = true;
        this.route.paramMap
            .pipe(switchMap((param: ParamMap) => {
                return this.apiService.getArtist(param.get('name'));
            }))
            .pipe(switchMap((artist: Artist) => {
                this.artist = artist;
                this.editModel = artist;
                this.loading = false;
                this.AASDLink = this.getAASDLink(this.artist);
                this.wikiLink = this.getWikiLink(this.artist);
                return forkJoin([this.checkAASDLink(this.AASDLink), this.checkWikiLink(this.wikiLink)]);
            }))
            .subscribe((response: any) => {
                this.wikiLinkLoader = false;
                this.AASDLinkLoader = false;
            });
    }

    checkAASDLink(link: string): Observable<boolean> {
        return this.externalLinkService.checkAASDLink(link)
            .pipe(map((response: boolean) => {
                return response;
            }));
    }

    checkWikiLink(link: string): Observable<boolean> {
        return this.externalLinkService.checkWikiLink(link)
            .pipe(map((response: boolean) => {
                return response;
            }));
    }

    getAASDLink(artist: Artist) {
        this.isAASDLinkFound = true;
        if (artist.bio.AASDLink) {
            return "https://www.aasd.com.au/index.cfm/artist/?concat=" + artist.bio.AASDLink;
        } else if (artist.name != "") {
            var full_name = artist.name.split(" ");
            return "https://www.aasd.com.au/index.cfm/artist/?concat=" + full_name[1] + full_name[0]
        } else {
            this.isAASDLinkFound = false;
            return "";
        }
    };

    getWikiLink(artist: Artist) {
        this.isWikiLinkFound = true;
        if (artist.bio.WikiLink) {
            return "https://en.wikipedia.org/wiki/" + artist.bio.WikiLink;
        } else if (artist.name != "") {
            var full_name = artist.name.split(" ");
            return "https://en.wikipedia.org/wiki/" + full_name.join("_")
        } else {
            this.isWikiLinkFound = false;
            return "";
        }
    };

    saveArtist(editModel: Artist) {
        this.apiService.saveArtist(editModel)
            .subscribe((isUpdated: boolean) => {
                if (isUpdated) {
                    this.editMode = false;
                    this.msg = "Updated successfully";
                    this.ngOnInit();
                } else {
                    this.msg = "Failed to update";
                }
            });
    }
}
