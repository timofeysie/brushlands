import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './pages/login/login.component';
import {RouterModule} from '@angular/router';
import {ArtworkComponent} from './pages/artwork/artwork.component';


const routes = [
    {path: 'login', component: LoginComponent},
    {path: 'artworks', component: ArtworkComponent}
];

@NgModule(
    {
        imports: [
            CommonModule,
            RouterModule.forRoot(routes)
        ],
        declarations: [],
        exports: [RouterModule]
    })
export class AppRoutingModule {
}
