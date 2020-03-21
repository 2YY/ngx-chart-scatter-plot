import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { ExamplePlotsDataService } from './example-plots-data.service';
import * as PIXI from '../../projects/lib-ngx-chart-scatter-plot/src/lib/pixi.js';
import {LibNgxChartScatterPlotService} from '../../projects/lib-ngx-chart-scatter-plot/src/lib/lib-ngx-chart-scatter-plot.service';
import {LibNgxChartScatterPlotOptions} from '../../projects/lib-ngx-chart-scatter-plot/src/lib/lib-ngx-chart-scatter-plot-options';
import {LibNgxChartScatterPlotComponent} from '../../projects/lib-ngx-chart-scatter-plot/src/lib/lib-ngx-chart-scatter-plot.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('chartScatterPlot', {read: LibNgxChartScatterPlotComponent}) chartScatterPlotRef: LibNgxChartScatterPlotComponent;

  plots = this.examplePlotsData.generateRandomPlot(1000, -100, 100);
  camera = new PIXI.Rectangle(-100, -100, 100, 100);
  options: LibNgxChartScatterPlotOptions = {
    origin: 'leftBottom',
    invisibleWall: new PIXI.Rectangle(-110, -110, 110, 110)
  };

  constructor(public examplePlotsData: ExamplePlotsDataService, public libNgxChartScatterPlotService: LibNgxChartScatterPlotService) {}

}
