import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import {ArtworksComponent} from './pages/artworks/artworks.component';
import {HttpClientModule} from '@angular/common/http';
import {ArtworkComponent} from './pages/artwork/artwork.component';
import {ArtistComponent} from './pages/artist/artist.component';
import {LocationsComponent} from './pages/locations/locations.component';
import { UserPermissionsComponent } from './pages/user-permissions/user-permissions.component';
import { UploadComponent } from './pages/upload/upload.component';
import { CollectionComponent } from './pages/collection/collection.component';
import { SortPipe } from './sort.pipe';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ArtworksComponent,
        ArtworkComponent,
        ArtistComponent,
        LocationsComponent,
        UserPermissionsComponent,
        UploadComponent,
        CollectionComponent,
        SortPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
