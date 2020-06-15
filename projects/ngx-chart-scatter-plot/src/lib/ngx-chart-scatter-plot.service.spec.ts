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
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(19, 0))).toEqual(1);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(0, 19))).toEqual(2);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(19, 19))).toEqual(3);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(29, 0))).toEqual(4);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(39, 0))).toEqual(5);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(29, 19))).toEqual(6);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(39, 19))).toEqual(7);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(0, 29))).toEqual(8);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(19, 29))).toEqual(9);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(0, 39))).toEqual(10);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(19, 39))).toEqual(11);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(29, 29))).toEqual(12);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(39, 29))).toEqual(13);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(29, 39))).toEqual(14);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(39, 39))).toEqual(15);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(49, 0))).toEqual(16);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(59, 0))).toEqual(17);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(49, 19))).toEqual(18);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(59, 19))).toEqual(19);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(69, 0))).toEqual(20);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(79, 0))).toEqual(21);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(69, 19))).toEqual(22);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(79, 19))).toEqual(23);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(49, 29))).toEqual(24);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(59, 29))).toEqual(25);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(49, 39))).toEqual(26);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(59, 39))).toEqual(27);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(69, 29))).toEqual(28);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(79, 29))).toEqual(29);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(69, 39))).toEqual(30);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(79, 39))).toEqual(31);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(0, 49))).toEqual(32);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(19, 49))).toEqual(33);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(0, 59))).toEqual(34);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(19, 59))).toEqual(35);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(29, 49))).toEqual(36);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(39, 49))).toEqual(37);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(29, 59))).toEqual(38);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(39, 59))).toEqual(39);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(0, 69))).toEqual(40);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(19, 69))).toEqual(41);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(0, 79))).toEqual(42);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(19, 79))).toEqual(43);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(29, 69))).toEqual(44);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(39, 69))).toEqual(45);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(29, 79))).toEqual(46);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(39, 79))).toEqual(47);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(49, 49))).toEqual(48);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(59, 49))).toEqual(49);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(49, 59))).toEqual(50);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(59, 59))).toEqual(51);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(69, 49))).toEqual(52);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(79, 49))).toEqual(53);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(69, 59))).toEqual(54);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(79, 59))).toEqual(55);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(49, 69))).toEqual(56);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(59, 69))).toEqual(57);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(49, 79))).toEqual(58);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(59, 79))).toEqual(59);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(69, 69))).toEqual(60);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(79, 69))).toEqual(61);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(69, 79))).toEqual(62);
    expect(service.getMortonNumber(new PIXI.Point(80, 80), new PIXI.Point(80, 80))).toEqual(63);
  });
});
