import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './pages/login/login.component';
import {RouterModule} from '@angular/router';
import {ArtworksComponent} from './pages/artworks/artworks.component';
import {AuthGuard} from './guards/auth/auth.guard';

const routes = [
  {path: 'login', component: LoginComponent},
  {path: 'artworks', component: ArtworksComponent, canActivate: [AuthGuard]},
];

@NgModule(
    {
      imports: [
        CommonModule,
        RouterModule.forRoot(routes),
      ],
      declarations: [],
      exports: [RouterModule],
    })
export class AppRoutingModule {
}
