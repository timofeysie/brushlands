import {TestBed, inject} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';

import {ExternalLinkService} from './external-link.service';

describe('ExternalLinkService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [ExternalLinkService]
        });
    });

    it('should be created', inject([ExternalLinkService], (service: ExternalLinkService) => {
        expect(service).toBeTruthy();
    }));
});
