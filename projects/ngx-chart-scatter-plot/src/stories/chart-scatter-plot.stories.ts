import {NgxChartScatterPlotModule} from '../lib/ngx-chart-scatter-plot.module';
import {Component, NgModule, ViewChild} from '@angular/core';
import {NgxChartScatterPlotService} from '../lib/ngx-chart-scatter-plot.service';
import {NgxChartScatterPlotComponent} from '../lib/ngx-chart-scatter-plot.component';
import * as PIXI from '../lib/pixi.js';
import {ChartOptions} from '../lib/chart-options';
import {Plot} from '../lib/plot';
import {v4 as uuid} from 'uuid';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export default {
  title: 'ChartScatterPlot',
};

////////////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'lib-basic-usage',
  template: `
    <ng-container>
      <p [formGroup]='plotForm'>
        <label>
          <span>Plot Amount</span>
          <input type='number' [formControlName]="'plotAmount'">
        </label>
        <button (click)="shufflePlot()" [disabled]="plotForm.invalid">Apply</button>
      </p>
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
    </ng-container>
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

  plotForm = new FormGroup({
    plotAmount: new FormControl('', [Validators.required, Validators.min(0)])
  });
  plots: Plot[] = [];
  camera = new PIXI.Rectangle(-100, -100, 100, 100);
  options: ChartOptions = {
    origin: 'leftBottom',
    invisibleWall: new PIXI.Rectangle(-100, -100, 100, 100),
    invisibleWallMargin: 20,
    tickResolution: 4
  };

  constructor(public chartScatterPlotService: NgxChartScatterPlotService) {
  }

  shufflePlot() {
    this.plots = this.generateRandomPlot(parseInt(this.plotForm.get('plotAmount').value, 10), -100, 100);
  }

  private static generateRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private generateRandomPlot(amount: number, min: number, max: number): Plot[] {
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
  imports: [ReactiveFormsModule, NgxChartScatterPlotModule],
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
