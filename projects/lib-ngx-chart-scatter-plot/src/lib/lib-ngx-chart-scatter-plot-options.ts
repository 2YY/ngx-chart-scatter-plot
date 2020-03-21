import * as PIXI from './pixi.js';

export interface LibNgxChartScatterPlotOptions {
  origin: 'leftTop' | 'rightTop' | 'rightBottom' | 'leftBottom';

  /**
   * Camera can project only in this bounds.
   */
  invisibleWall: PIXI.Rectangle;
}
