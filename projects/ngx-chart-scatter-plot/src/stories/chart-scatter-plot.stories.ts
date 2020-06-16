import {NgxChartScatterPlotModule} from '../lib/ngx-chart-scatter-plot.module';
import {Component, NgModule, ViewChild} from '@angular/core';
import {NgxChartScatterPlotService} from '../lib/ngx-chart-scatter-plot.service';
import {NgxChartScatterPlotComponent} from '../lib/ngx-chart-scatter-plot.component';
import * as PIXI from '../lib/pixi.js';
import {ChartOptions} from '../lib/chart-options';
import {Plot} from '../lib/plot';
import {v4 as uuid} from 'uuid';

export default {
  title: 'ChartScatterPlot',
};

////////////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'lib-basic-usage',
  template: `
    <div class="chart">
      <lib-ngx-chart-scatter-plot
        #chartScatterPlot
        [plots]="plots"
        [camera]="camera"
        [options]="options"
        (mousedown)="
          chartScatterPlotService.panStart(
            $event,
            camera,
            chartScatterPlotRef.getMatTransform(),
            chartScatterPlotRef.getMatTransformToggleOrigin()
          )
        "
        (mousemove)="camera = chartScatterPlotService.panMove($event, camera, options)"
        (mouseup)="chartScatterPlotService.panEnd()"
        (mouseleave)="chartScatterPlotService.panEnd()"
        (wheel)="
          camera = chartScatterPlotService.zoom(
            $event,
            camera,
            options,
            chartScatterPlotRef.getMatTransform(),
            chartScatterPlotRef.getCursorPos()
          )
        "
      ></lib-ngx-chart-scatter-plot>
    </div>
  `,
  styles: [`
    .chart {
      position: relative;
      width: 500px;
      height: 500px;
      margin: 40px;
      border: .1rem dotted #ccc;
    }
  `]
})
class ExampleComponent {
  @ViewChild('chartScatterPlot', {read: NgxChartScatterPlotComponent}) chartScatterPlotRef: NgxChartScatterPlotComponent;

  // plots = this.examplePlotsData.generateRandomPlot(1000, -100, 100).map(v => {
  //   v.position.x *= .5;
  //   v.position.x += 50;
  //   v.position.y *= .5;
  //   v.position.y += 50;
  //   return v;
  // });
  plots = [
    {id: uuid(), position: new PIXI.Point(0, 0), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(-12.5, 5), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(-25, 0), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(-37.5, 5), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(-50, 0), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(-62.5, 5), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(-75, 0), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(-87.5, 5), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(-100, 0), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(12.5, 5), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(25, 0), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(37.5, 5), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(50, 0), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(62.5, 5), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(75, 0), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(87.5, 5), r: 5, color: 0x000000, alpha: .618046972},
    {id: uuid(), position: new PIXI.Point(100, 0), r: 5, color: 0x000000, alpha: .618046972},
  ];
  camera = new PIXI.Rectangle(-100, -100, 100, 100);
  options: ChartOptions = {
    origin: 'leftBottom',
    invisibleWall: new PIXI.Rectangle(-100, -100, 100, 100),
    invisibleWallMargin: 20,
    tickResolution: 4
  };

  constructor(public chartScatterPlotService: NgxChartScatterPlotService) {
  }

  private static generateRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  generateRandomPlot(amount: number, min: number, max: number): Plot[] {
    const result = [];
    for (let i = 0; i < amount; i++) {
      result.push({
        position: new PIXI.Point(
          ExampleComponent.generateRandomFloat(min, max),
          ExampleComponent.generateRandomFloat(min, max)
        ),
        color: 0x000000,
        alpha: .618046972,
        r: 5
      } as Plot);
    }
    return result;
  }
}

@NgModule({
  declarations: [ExampleComponent],
  imports: [NgxChartScatterPlotModule],
  exports: [ExampleComponent]
})
class ExampleModule {
}

////////////////////////////////////////////////////////////////////////////////////////////////////

export const BasicUsage = () => ({
  component: ExampleComponent,
  props: {},
  moduleMetadata: {
    imports: [NgxChartScatterPlotModule, ExampleModule]
  }
});
