import * as PIXI from './pixi';

export interface ChartOptions {
  /**
   * Chart axis origin.
   */
  origin: 'leftTop' | 'rightTop' | 'rightBottom' | 'leftBottom';

  /**
   * Camera can project only in this bounds.
   */
  invisibleWall: PIXI.Rectangle;

  /**
   * Margin outside of bounds invisibleWall.
   */
  invisibleWallMargin: number;

  /**
   * value how many split the chart by ticks
   */
  tickResolution: number;
}
