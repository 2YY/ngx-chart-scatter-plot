import {TestBed} from '@angular/core/testing';

import {NgxChartScatterPlotService} from './ngx-chart-scatter-plot.service';

describe('NgxChartScatterPlotService', () => {
  let service: NgxChartScatterPlotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxChartScatterPlotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
