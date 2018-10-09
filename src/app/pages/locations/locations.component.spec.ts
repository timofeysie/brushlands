import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ApiService} from '../../services/api/api.service';
import {Artwork} from '../../models/artwork';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';
import {LocationsComponent} from './locations.component';
import {FormsModule} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {PermissionService} from 'src/app/services/permission/permission.service';

describe('LocationsComponent', () => {
    let component: LocationsComponent;
    let fixture: ComponentFixture<LocationsComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;
    let permissionServiceSpy: jasmine.SpyObj<PermissionService>;

    beforeEach(() => {
        apiServiceSpy = jasmine.createSpyObj('ApiService', ['artworks']);
        const artwork = new Artwork(1, 'title', 'artist');
        artwork.officeLocation = 'office-location';
        const artworks = [artwork];
        apiServiceSpy.artworks.and.returnValue(of(artworks));

        permissionServiceSpy = jasmine.createSpyObj('PermissionService', ['checkPermission']);
        permissionServiceSpy.checkPermission.and.returnValue(of(true));

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, FormsModule],
            providers: [
                {provide: ApiService, useValue: apiServiceSpy},
                {provide: PermissionService, useValue: permissionServiceSpy}
            ],
            declarations: [LocationsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(LocationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should call ApiService:artworks one time', () => {
        expect(apiServiceSpy.artworks.calls.count()).toBe(1);
    });

    it('should show loaded artworks', () => {
        fixture.detectChanges();
        const host: HTMLElement = fixture.nativeElement;
        expect(host.textContent).toContain('title', 'show artworks title');
        expect(host.textContent).toContain('artist', 'show artworks artist');
        expect(host.textContent).toContain('office-location', 'show artworks location');
    });
});
