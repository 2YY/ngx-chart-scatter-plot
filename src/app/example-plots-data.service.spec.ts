import { TestBed } from '@angular/core/testing';

import { ExamplePlotsDataService } from './example-plots-data.service';

describe('ExamplePlotsDataService', () => {
  let service: ExamplePlotsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamplePlotsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
