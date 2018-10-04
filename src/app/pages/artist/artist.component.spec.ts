import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ArtistComponent} from './artist.component';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientModule} from '@angular/common/http';
import {ApiService} from '../../services/api/api.service';
import {Artist} from '../../models/artist'
import {of} from 'rxjs';

describe('ArtistComponent', () => {
    let component: ArtistComponent;
    let fixture: ComponentFixture<ArtistComponent>;
    let apiServiceSpy: jasmine.SpyObj<ApiService>;

    beforeEach(async(() => {
        apiServiceSpy = jasmine.createSpyObj('ApiService', ['getArtist']);

        const artist = new Artist('name');
        artist.skinName = 'skinName';
        artist.language = 'language';
        artist.region = 'region';
        artist.dreaming = 'dreaming';
        artist.DOB = 'DOB';
        artist.bio.title = 'bio_title';
        artist.bio.body = 'bio_body';

        apiServiceSpy.getArtist.and.returnValue(of(artist));
        TestBed.configureTestingModule({
            imports: [FormsModule, RouterTestingModule, HttpClientModule],
            declarations: [ArtistComponent],
            providers: [{provide: ApiService, useValue: apiServiceSpy}]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ArtistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should call ApiService:getArtist one time', () => {
        expect(apiServiceSpy.getArtist.calls.count()).toBe(1);
    });

    it('should show Artist details on screen', () => {
        fixture.detectChanges();
        const host: HTMLElement = fixture.nativeElement;
        expect(host.textContent).toContain('name', 'Artist name showed');
        expect(host.textContent).toContain('skinName', 'Artist skinName showed');
        expect(host.textContent).toContain('language', 'Artist language showed');
        expect(host.textContent).toContain('region', 'Artist region showed');
        expect(host.textContent).toContain('dreaming', 'Artist dreaming showed');
        expect(host.textContent).toContain('DOB', 'Artist DOB showed');
        expect(host.textContent).toContain('bio_title', 'Artist bio_title showed');
        expect(host.textContent).toContain('bio_body', 'Artist bio_body showed');
    });
});
