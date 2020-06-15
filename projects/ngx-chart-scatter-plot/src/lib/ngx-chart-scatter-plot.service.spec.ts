import {TestBed} from '@angular/core/testing';
import * as PIXI from './pixi.js';

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

  it('should be calculated correct morton number', () => {
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(0, 0))).toEqual(0);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(1, 1))).toEqual(0);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(0, 65))).toEqual(40);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(65, 65))).toEqual(60);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(65, 0))).toEqual(20);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(79, 79))).toEqual(63);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(80, 80))).toEqual(63);
  });
});
