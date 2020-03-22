import { Injectable } from '@angular/core';
import {Plot} from '../../projects/lib-ngx-chart-scatter-plot/src/lib/plot';
import * as PIXI from '../../projects/lib-ngx-chart-scatter-plot/src/lib/pixi.js';

@Injectable({
  providedIn: 'root'
})
export class ExamplePlotsDataService {

  private static generateRandomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  generateRandomPlot(amount: number, min: number, max: number): Plot[] {
    const result = [];
    for (let i = 0; i < amount; i++) {
      result.push({
        position: new PIXI.Point(
          ExamplePlotsDataService.generateRandomFloat(min, max),
          ExamplePlotsDataService.generateRandomFloat(min, max)
        ),
        color: 0x000000,
        alpha: .618046972,
        r: 5
      } as Plot);
    }
    return result;
  }
}
