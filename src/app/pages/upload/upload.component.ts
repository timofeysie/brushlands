import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { forkJoin, Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
    artworkForm: FormGroup;
    lastUpdatedDate: any;
    showStartedToProcess: boolean;
    showBackupProcessing: boolean;
    uploadedFileResult: boolean;
    isBackupSuccess: boolean;
    fileGenerating: boolean;
    uploadedFile: any;
    error: boolean;

    @ViewChild('file')
    fileInput;

    constructor(private apiService: ApiService) {
        this.artworkForm = new FormGroup({
            file: new FormControl()
        });
    }

    ngOnInit() {

        this.showBackupProcessing = false;
        this.isBackupSuccess = false;
        this.fileGenerating = false;
        this.showStartedToProcess = false;
        this.uploadedFileResult = false;
        this.error = false;
        this.getLastUpdate();
    }

    uploadFile() {
        this.showBackupProcessing = false;
        this.isBackupSuccess = false;
        this.showStartedToProcess = false;
        this.uploadedFileResult = false;
        this.error = false;

        const input = this.fileInput.nativeElement;
        if (input.files && input.files[0]) {
            const fileToUpload = input.files[0];
            this.uploadedFile = fileToUpload;
            this.showStartedToProcess = true;

            if (fileToUpload) {
                if (fileToUpload.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    this.apiService.uploadFile(fileToUpload).subscribe((response) => {

                        this.showStartedToProcess = false;
                        if (response == "done") {
                            this.uploadedFileResult = true;
                        }
                        this.getLastUpdate();
                    });
                } else {
                    this.showStartedToProcess = false;
                    this.error = true;
                }
            }
        }
    }

    getLastUpdate() {
        this.apiService.getLastUpdateDate().subscribe((response) => {
            this.lastUpdatedDate = response;
        });
    }

    getFromFirebase() {
        this.showBackupProcessing = true;
        var newJsonArray = [];

        let getArtworks = this.apiService.artworks();
        let getArtists = this.apiService.artists();
        let getImages = this.apiService.images();

        forkJoin(getArtists, getArtworks, getImages).subscribe(responseList => {
            var stringifiedArray = JSON.stringify(responseList);
            var options = { fetched_data: stringifiedArray };

            this.apiService.saveFromDb(options).subscribe((response) => {
                this.showBackupProcessing = false;
                this.isBackupSuccess = true;
            });
        });
    }

    downloadBackup() {
        this.fileGenerating = true;
        this.apiService.downloadBackup().subscribe((response) => {
            function doesFileExist(urlToFile) {
                var xhr = new XMLHttpRequest();
                xhr.open('HEAD', urlToFile, false);
                xhr.send();

                if (xhr.status == 404) {
                    return false;
                } else {
                    return true;
                }
            }
            var fileCheck = doesFileExist(response.data);

            if (fileCheck == true) {
                this.fileGenerating = false;
                const date = new Date();
                let fDate = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '-' + date.getHours() + '-' + date.getMinutes() + '-' + date.getSeconds();
                var fileName = 'artwork-backup-' + fDate + '.docx';
                var downloadLink = document.createElement('a');
                downloadLink.setAttribute('href', response.data);
                downloadLink.setAttribute('download', fileName);
                downloadLink.click();
            }
        });
    }
}
