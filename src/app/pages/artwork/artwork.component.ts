import {Component, OnInit} from '@angular/core';
import {Artwork} from '../../models/artwork';

@Component({
    selector: 'app-artwork',
    templateUrl: './artwork.component.html',
    styleUrls: ['./artwork.component.scss']
})
export class ArtworkComponent implements OnInit {

    loading: boolean;
    artworks: Artwork[];
    error: string;

    constructor() {
        this.loading = true;
        this.error = 'this is the error';
        this.artworks = [new Artwork(1, 'artwork 01', 'artist 01')
            , new Artwork(2, 'artwork 02', 'artist 02')];
    }

    ngOnInit() {
    }

}
