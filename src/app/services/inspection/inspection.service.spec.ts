import { TestBed, inject } from '@angular/core/testing';

import { InspectionService } from './inspection.service';

describe('InspectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InspectionService]
    });
  });

  it('should be created', inject([InspectionService], (service: InspectionService) => {
    expect(service).toBeTruthy();
  }));
});
