import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './pages/login/login.component';
import {RouterModule} from '@angular/router';
import {ArtworksComponent} from './pages/artworks/artworks.component';
import {AuthGuard} from './guards/auth/auth.guard';
import {ArtworkComponent} from './pages/artwork/artwork.component';
import {ArtistComponent} from './pages/artist/artist.component';
import {LocationsComponent} from './pages/locations/locations.component';
import {UserPermissionsComponent} from './pages/user-permissions/user-permissions.component';

const routes = [
    {path: 'login', component: LoginComponent},
    {path: 'artworks', component: ArtworksComponent, canActivate: [AuthGuard]},
    {path: 'artwork/:refNo', component: ArtworkComponent, canActivate: [AuthGuard]},
    {path: 'artist/:name', component: ArtistComponent, canActivate: [AuthGuard]},
    {path: 'locations', component: LocationsComponent, canActivate: [AuthGuard]},
    {path: 'locations/:artistName', component: LocationsComponent, canActivate: [AuthGuard]},
    {path: 'user-permissions', component: UserPermissionsComponent, canActivate: [AuthGuard]},
    {path: '', redirectTo : '/artworks', pathMatch: 'full'}
];

@NgModule({
    imports: [CommonModule, RouterModule.forRoot(routes)],
    declarations: [],
    exports: [RouterModule]
})
export class AppRoutingModule {}
