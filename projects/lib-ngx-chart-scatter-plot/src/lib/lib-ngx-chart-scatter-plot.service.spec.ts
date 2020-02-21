import { TestBed } from '@angular/core/testing';

import { LibNgxChartScatterPlotService } from './lib-ngx-chart-scatter-plot.service';

describe('LibNgxChartScatterPlotService', () => {
  let service: LibNgxChartScatterPlotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibNgxChartScatterPlotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
