import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {IsAuthorizedService} from '../../services/auth/isAuthorizedService';
import {FilterPipe} from '../../services/customPipes/customPipes.service';
import {Artwork} from '../../models/artwork';
import {Artist} from '../../models/artist';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap, map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';
import {ExternalLinkService} from '../../services/external-link/external-link.service';
import {Pipe, PipeTransform} from '@angular/core';

@Component({
    selector: 'app-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
    providers: [FilterPipe]
})

export class LocationsComponent implements OnInit {

    loading: boolean;
    retrivedData: Artwork[];
    artists: Artist[] = [];
    artworks: Artwork[] = [];
    error: string;
    newJsonArray: any[] = [];
    officelocations: any[] = [];
    filter: any = {};
    newFilter: any = {};
    showLightBox: boolean;
    inspectionOn: boolean;
    flexBoxImage: string;
    viewLocationInsuredAndProvenancePermission: boolean;

    constructor(public apiService: ApiService, private route: ActivatedRoute, private filterPipe: FilterPipe, private isAuthorizedService: IsAuthorizedService) {
        this.inspectionOn = false; // TODO replace this with settings service
        this.showLightBox = false;
        this.flexBoxImage = null;
        this.error = null;
        this.loading = true;

        if (this.route.snapshot.params['artistName']) {
            this.filter.artist = this.route.snapshot.params['artistName'];
        }
        this.route.queryParams.subscribe(params => {
            if (params['location']) {
                this.filter.officeLocation = params['location'];
            }
        });

        this.getArtworks();

        this.isAuthorizedService.checkAuth("view-location-insured-and-provenance").subscribe((response) => {
            if (response.status == 200) {
                this.viewLocationInsuredAndProvenancePermission = true;
            } else if (response.status == 401) {
                this.viewLocationInsuredAndProvenancePermission = false;
            }
        });
    }

    private getArtworks() {
        this.apiService.artworks().subscribe((response) => {
            if (response.length === 0) {
                this.error = 'Please upload artworks data.';
            }
            this.loading = false;
            this.retrivedData = response;

            for (var key in this.retrivedData) {
                this.newJsonArray.push(this.retrivedData[key]);
            }

            //sort by 'officeLocation'
            this.newJsonArray.sort((a, b) => a.officeLocation.localeCompare(b.officeLocation));

            var newData = [];
            var color = 'locationBg0';
            var locationBg = 0;

            for (var i = 0; i < this.newJsonArray.length; i++) {
                var item = this.newJsonArray[i];

                /* Cycle thru 0 - 3 different backgound colors based on location */
                var index = this.officelocations.findIndex(val => val.location == item.officeLocation);
                if (index === -1) {
                    locationBg++; // go to next color if location is different from last loop
                    if (locationBg > 4) {
                        locationBg = 0; // if it's over 2 go back to 0
                    }
                    color = 'locationBg' + locationBg;
                    var location = {location: item.officeLocation, color: color};
                    this.officelocations.push(location);
                    item.locationBg = color; // set the new bg to be used heref
                } else {
                    color = this.officelocations[index].color;
                    item.locationBg = color;
                }

                if (this.artists.indexOf(item.artist) == -1 && item.artist !== "") {
                    this.artists.push(item.artist);
                }
                newData.push(item);
            }
            this.artworks = newData;
            this.filterArtworks(this.filter);
        });
    }

    filterArtworks(filter: any) {
        if (filter.officeLocation !== "" || filter.artist !== "") {
            if (filter.officeLocation !== "" && filter.officeLocation != undefined) {
                this.newFilter['officeLocation'] = filter.officeLocation;
            }
            if (filter.artist !== "" && filter.artist != undefined) {
                this.newFilter['artist'] = filter.artist;
            }
        }

        this.artworks = this.filterPipe.transform(this.artworks, this.newFilter);

        this.newFilter = {};

        if (filter.searchTerm !== "") {
            if (filter.searchArtist || filter.searchLocation) {
                if (filter.searchArtist) {
                    this.newFilter.artist = filter.searchTerm;
                }
                if (filter.searchLocation) {
                    this.newFilter.officeLocation = filter.searchTerm;
                }
                this.artworks = this.filterPipe.transform(this.artworks, this.newFilter);
            }
        }
    }


    openLightBox(artwork: Artwork) {
        this.apiService.getImage(artwork.assetRefNo)
            .subscribe((image: string) => {
                this.flexBoxImage = image;
                this.showLightBox = true;
            });
    }

    closeLightBox() {
        this.showLightBox = false;
    }

    ngOnInit() {
    }
}
