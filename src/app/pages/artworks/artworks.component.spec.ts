import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ArtworksComponent} from './artworks.component';
import {ApiService} from '../../services/api/api.service';
import {Artwork} from '../../models/artwork';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('ArtworksComponent', () => {
    let component: ArtworksComponent;
    let fixture: ComponentFixture<ArtworksComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        apiServiceSpy = jasmine.createSpyObj('ApiService', ['artworks']);
        const artworks = [new Artwork(1, 'title', 'artist')];
        apiServiceSpy.artworks.and.returnValue(of(artworks));
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [{provide: ApiService, useValue: apiServiceSpy}],
            declarations: [ArtworksComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArtworksComponent);
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
    });

    it('should show update button if no artworks', () => {
        component.artworks = [];
        component.error = 'add some artworks';
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Update');
    });
});
