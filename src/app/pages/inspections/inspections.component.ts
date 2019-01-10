import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
    selector: 'app-inspections',
    templateUrl: './inspections.component.html',
    styleUrls: ['./inspections.component.scss']
})
export class InspectionsComponent implements OnInit {
    inspectionOn: boolean;
    inspectedArtworks: any;

    constructor(
        private apiService: ApiService
    ) { }

    ngOnInit() {
        this.inspectionOn = false;
        this.inspectedArtworks = [];
        this.apiService.getInspectedArtworks().subscribe((response) => {

            for (var i = 0; i < response.length; i++) {
                var item = response[i];
                if (item.inspected) {
                    this.inspectedArtworks.push(item);
                }
            }
        });
    }

    startInspection() {
        this.inspectionOn = true;
        this.apiService.inspect().subscribe((response) => {
            console.log(response);
        });
    }

    stopInspection(){
        this.inspectionOn = false;
    }

    resetInspection(){
        this.inspectionOn = false;
    }

}
