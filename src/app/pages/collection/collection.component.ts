import { Component, OnInit } from '@angular/core';
import { Artwork } from '../../models/artwork';
import { ApiService } from 'src/app/services/api/api.service';


@Component({
    selector: 'app-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {
    artworkList: any;
    sortReverse: boolean;
    sortType: any;

    constructor(
        private apiService: ApiService
    ) {}

    ngOnInit() {
        this.sortReverse = true;
        this.sortType = '';
        this.apiService.artworks().subscribe((response) => {
            this.artworkList = response;
        });
    }
    changeSort(sort) {
        this.sortType = sort;
        this.sortReverse = !this.sortReverse;
    }

}
