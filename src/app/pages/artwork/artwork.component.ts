import {Component, OnInit} from '@angular/core';
import {Artwork} from '../../models/artwork';
import {ApiService} from '../../services/api/api.service';

@Component({
    selector: 'app-artwork',
    templateUrl: './artwork.component.html',
    styleUrls: ['./artwork.component.scss'],
})
export class ArtworkComponent implements OnInit {

    loading: boolean;
    artworks: Artwork[];
    error: string;

    constructor(public apiService: ApiService) {
        this.error = null;
        this.loading = true;
        this.getArtworks();
    }

    private getArtworks() {
        this.apiService.artworks().subscribe((response) => {
            if (response.length === 0) {
                this.error = 'Please upload artwork data.';
            }
            this.artworks = response;
            this.loading = false;
        });
    }

    ngOnInit() {
    }

}
