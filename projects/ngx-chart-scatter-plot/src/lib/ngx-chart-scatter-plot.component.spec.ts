import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NgxChartScatterPlotComponent} from './ngx-chart-scatter-plot.component';

describe('NgxChartScatterPlotComponent', () => {
  let component: NgxChartScatterPlotComponent;
  let fixture: ComponentFixture<NgxChartScatterPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxChartScatterPlotComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxChartScatterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
