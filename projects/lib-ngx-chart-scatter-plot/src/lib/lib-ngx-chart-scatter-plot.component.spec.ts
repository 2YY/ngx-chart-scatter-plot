import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibNgxChartScatterPlotComponent } from './lib-ngx-chart-scatter-plot.component';

describe('LibNgxChartScatterPlotComponent', () => {
  let component: LibNgxChartScatterPlotComponent;
  let fixture: ComponentFixture<LibNgxChartScatterPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibNgxChartScatterPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibNgxChartScatterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
