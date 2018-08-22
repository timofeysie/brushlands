import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import { ArtworksComponent } from './pages/artworks/artworks.component';
import {HttpClientModule} from '@angular/common/http';
import { ArtworkComponent } from './pages/artwork/artwork.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ArtworksComponent,
        ArtworkComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
