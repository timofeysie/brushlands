import {Component, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
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
    additionalData: FormGroup;
    artwork: Artwork;
    showLightBox: boolean;
    inspectionOn: boolean;
    flexBoxImage: string;
    f: any; // TODO for progress
    uploadedFile: any;

    @ViewChild('file')
    fileInput;


    constructor(private apiService: ApiService, private route: ActivatedRoute) {
        this.f = {};
        this.inspectionOn = false; // TODO replace this with settings service
        this.showLightBox = false;
        this.flexBoxImage = null;
        this.additionalData = new FormGroup({
            file: new FormControl(),
            textarea: new FormControl()
        });

        this.route.paramMap
            .pipe(switchMap((param: ParamMap) => {
                return this.apiService.artwork(param.get('refNo'));
            }))
            .subscribe((artwork: Artwork) => {
                this.artwork = artwork;
                // console.log(this.artwork);

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

    uploadAdditionalImages(){
        let textarea = this.additionalData.value.textarea;
        const input = this.fileInput.nativeElement;
        if (input.files && input.files[0]) {
            const fileToUpload = input.files[0];
            this.uploadedFile = fileToUpload;
            if (fileToUpload) {
                this.apiService.additionalArtwordData(fileToUpload).subscribe((response) => {
                    console.log(response);
                });
            }
        }
    }

}
