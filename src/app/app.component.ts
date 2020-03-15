import { Component } from '@angular/core';
import { ExamplePlotsDataService } from './example-plots-data.service';
import * as PIXI from '../../projects/lib-ngx-chart-scatter-plot/src/lib/pixi.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  plots = this.examplePlotsData.generateRandomPlot(100, -100, 100);
  camera = new PIXI.Rectangle(-162, -162, 162, 162);

  constructor(public examplePlotsData: ExamplePlotsDataService) {}

}
