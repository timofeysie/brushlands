import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ArtworkComponent} from './artwork.component';
import {ApiService} from '../../services/api/api.service';
import {Artwork} from '../../models/artwork';
import {of} from 'rxjs';
import {RouterTestingModule} from '@angular/router/testing';

describe('ArtworkComponent', () => {
    let component: ArtworkComponent;
    let fixture: ComponentFixture<ArtworkComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;

    beforeEach(() => {
        apiServiceSpy = jasmine.createSpyObj('ApiService', ['artworks']);
        const artworks = [new Artwork(1, 'title', 'artist')];
        apiServiceSpy.artworks.and.returnValue(of(artworks));
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [{provide: ApiService, useValue: apiServiceSpy}],
            declarations: [ArtworkComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ArtworkComponent);
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
        expect(host.textContent).toContain('title', 'show artwork title');
        expect(host.textContent).toContain('artist', 'show artwork artist');
    });

    it('should show update button if no artwork', () => {
        component.artworks = [];
        component.error = 'add some artworks';
        fixture.detectChanges();
        expect(fixture.nativeElement.textContent).toContain('Update');
    });
});
