import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './pages/login/login.component';
import {AppRoutingModule} from './app-routing.module';
import { ArtworkComponent } from './pages/artwork/artwork.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        ArtworkComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
