import {NgxChartScatterPlotModule} from '../lib/ngx-chart-scatter-plot.module';
import { Component, Input, NgModule, ViewChild } from '@angular/core';
import {NgxChartScatterPlotService} from '../lib/ngx-chart-scatter-plot.service';
import {NgxChartScatterPlotComponent} from '../lib/ngx-chart-scatter-plot.component';
import * as PIXI from '../lib/pixi.js';
import {ChartOptions} from '../lib/chart-options';
import {Plot} from '../lib/plot';
import { CommonModule } from '@angular/common';
import { Meta, Story } from '@storybook/angular';
import { Template } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'lib-basic-usage',
  template: `
    <ng-container>
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
      <p *ngIf="chartScatterPlot.pointerOverlappingPlotId !== null">Hover: {{ chartScatterPlot.pointerOverlappingPlotId }}</p>
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

  plotAmountData = 0;

  plots: Plot[] = [];
  camera = new PIXI.Rectangle(-100, -100, 100, 100);
  options: ChartOptions = {
    origin: 'leftBottom',
    invisibleWall: new PIXI.Rectangle(-100, -100, 100, 100),
    invisibleWallMargin: 20,
    tickResolution: 4
  };

  @Input() set plotAmount(amount: number) {
    this.plotAmountData = amount;
    this.reloadPlots();
  }

  constructor(public chartScatterPlotService: NgxChartScatterPlotService) {}

  reloadPlots() {
    this.plots = this.generateRandomPlot(this.plotAmountData, -100, 100);
  }

  private generateRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private generateRandomPlot(amount: number, min: number, max: number): Plot[] {
    const result = [];
    for (let i = 0; i < amount; i++) {
      result.push({
        id: i.toString(),
        position: new PIXI.Point(
          this.generateRandomFloat(min, max),
          this.generateRandomFloat(min, max)
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
  imports: [CommonModule, NgxChartScatterPlotModule],
  exports: [ExampleComponent]
})
class ExampleModule {
}

export default {
  title: 'ChartScatterPlot',
  component: ExampleComponent,
  moduleMetadata: {
    imports: [NgxChartScatterPlotModule, ExampleModule]
  }
} as Meta;

const Template: Story<ExampleComponent> = (args) => ({
  props: args
});

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  plotAmount: 0
};
