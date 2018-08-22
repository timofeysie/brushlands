import {Component, OnInit} from '@angular/core';
import {Artwork} from '../../models/artwork';
import {ApiService} from '../../services/api/api.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';

@Component({
    selector: 'app-artwork',
    templateUrl: './artwork.component.html',
    styleUrls: ['./artwork.component.scss']
})
export class ArtworkComponent implements OnInit {

    artwork: Artwork;
    showLightBox: boolean;
    inspectionOn: boolean;
    flexBoxImage: string;
    f: any; // TODO for progress
    additionalImages = {};

    constructor(private apiService: ApiService, private route: ActivatedRoute) {
        this.f = {};
        this.inspectionOn = false; // TODO replace this with settings service
        this.showLightBox = false;
        this.flexBoxImage = null;

        this.route.paramMap
            .pipe(switchMap((param: ParamMap) => {
                return this.apiService.artwork(param.get('refNo'));
            }))
            .subscribe((artwork: Artwork) => {
                this.artwork = artwork;
            });

    }

    ngOnInit() {
    }

    openLightBox() {
        this.apiService.getImage(this.artwork.assetRefNo)
            .subscribe((image: string) => {
                this.flexBoxImage = image;
                this.showLightBox = true;
            });
    }

    closeLightBox() {
        this.showLightBox = false;
    }

}
