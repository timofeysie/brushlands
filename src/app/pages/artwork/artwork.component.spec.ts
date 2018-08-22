import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ArtworkComponent} from './artwork.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ApiService} from '../../services/api/api.service';
import {Artwork} from '../../models/artwork';
import {of} from 'rxjs';

describe('ArtworkComponent', () => {
    let component: ArtworkComponent;
    let fixture: ComponentFixture<ArtworkComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;

    beforeEach(async(() => {
        const artworkStub = new Artwork(1, 'title 01', 'artist 01');
        apiServiceSpy = jasmine.createSpyObj('ApiService', ['artwork', 'getImage']);
        apiServiceSpy.artwork.and.returnValue(of(artworkStub));

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [ArtworkComponent],
            providers: [{provide: ApiService, useValue: apiServiceSpy}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ArtworkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show artwork details on screen', () => {
        fixture.detectChanges();

        const host: HTMLElement = fixture.nativeElement;

        expect(host.textContent).toContain('1', 'reference no shows');
        expect(host.textContent).toContain('title 01', 'title shows');
        expect(host.textContent).toContain('artist 01', 'artist shows');

    });

    it('should open lightbox when clicked on image and close when click on lightbox', () => {
        fixture.detectChanges();

        apiServiceSpy.getImage.and.returnValue(of('test-image-url'));

        const image = fixture.nativeElement.querySelector('.lightbox');
        image.click();

        fixture.detectChanges();
        let lightBox = fixture.nativeElement.querySelector('.lightbox-target');
        expect(lightBox).not.toBeNull('lightbox opend');

        lightBox.click();

        fixture.detectChanges();
        lightBox = fixture.nativeElement.querySelector('.lightbox-target');
        expect(lightBox).toBeNull();

    });
});
