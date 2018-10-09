import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api/api.service';
import {Artwork} from '../../models/artwork';
import {ActivatedRoute} from '@angular/router';
import {PermissionService} from '../../services/permission/permission.service';

@Component({
    selector: 'app-locations',
    templateUrl: './locations.component.html',
    styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent implements OnInit {
    loading: boolean;
    artists: string[] = [];
    artworks: Artwork[] = [];
    error: string;
    officelocations: any[] = [];
    filter: any = {};
    showLightBox: boolean;
    inspectionOn: boolean;
    flexBoxImage: string;
    viewLocationInsuredAndProvenancePermission: boolean;
    originalArtworks: Artwork[];

    constructor(
        private permissionService: PermissionService,
        public apiService: ApiService,
        private route: ActivatedRoute    ) {
        this.inspectionOn = false; // TODO replace this with settings service
        this.showLightBox = false;
        this.flexBoxImage = null;
        this.error = null;
        this.loading = true;

        this.filter = {
            officeLocation: '',
            artist: '',
            searchTerm: '',
            searchArtist: false,
            searchLocation: false
        };

        if (this.route.snapshot.params['artistName']) {
            this.filter.artist = this.route.snapshot.params['artistName'];
        }
        this.route.queryParams.subscribe(params => {
            if (params['location']) {
                this.filter.officeLocation = params['location'];
            }
        });

        this.getArtworks();

        this.permissionService
            .checkPermission('view-location-insured-and-provenance')
            .subscribe((response: boolean) => {
                this.viewLocationInsuredAndProvenancePermission = response;
            });
    }

    private getArtworks() {
        this.apiService.artworks().subscribe((response: Artwork[]) => {
            if (response.length === 0) {
                this.error = 'Please upload artworks data.';
            }
            this.loading = false;

            this.originalArtworks = response.sort((a, b) => a.officeLocation.localeCompare(b.officeLocation));

            let colorIndex = 0;

            this.originalArtworks.forEach((artwork: Artwork) => {
                const artistIndex = this.artists.findIndex(item => artwork.artist == item);

                if (artistIndex === -1) {
                    this.artists.push(artwork.artist);
                }

                const index = this.officelocations.findIndex(item => artwork.officeLocation == item);

                if (index === -1) {
                    colorIndex++;
                    if (colorIndex > 3) {
                        colorIndex = 0;
                    }

                    this.officelocations.push(artwork.officeLocation);
                }

                artwork.bgColor = `background-${colorIndex}`;
            });

            this.filterArtworks();
        });
    }

    filterArtworks() {
        const searchTerm = this.filter.searchTerm.toLowerCase();

        let filtered: Artwork[] = this.originalArtworks;

        if (this.filter.officeLocation !== '') {
            filtered = filtered.filter(artwork => {
                return artwork.officeLocation == this.filter.officeLocation;
            });
        }

        if (this.filter.artist != '') {
            filtered = filtered.filter(artwork => {
                return artwork.artist == this.filter.artist;
            });
        }

        if (this.filter.searchTerm != '') {
            filtered = filtered.filter(artwork => {
                const artist = artwork.artist.toLowerCase();
                const location = artwork.officeLocation.toLowerCase();

                const inArtist = artist.indexOf(searchTerm) !== -1;
                const inLocation = location.indexOf(searchTerm) !== -1;

                if (this.filter.searchArtist && !this.filter.searchLocation) {
                    return inArtist;
                }

                if (this.filter.searchLocation && !this.filter.searchArtist) {
                    return inLocation;
                }

                if (this.filter.searchLocation == this.filter.searchArtist) {
                    return inArtist || inLocation;
                }

                return artist.indexOf(searchTerm) !== -1;
            });
        }

        this.artworks = filtered;
    }

    openLightBox(artwork: Artwork) {
        this.apiService.getImage(artwork.assetRefNo).subscribe((image: string) => {
            this.flexBoxImage = image;
            this.showLightBox = true;
        });
    }

    closeLightBox() {
        this.showLightBox = false;
    }

    ngOnInit() {}
}
