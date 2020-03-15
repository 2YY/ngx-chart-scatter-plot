import * as PIXI from './pixi.js';

export interface Plot {
  position: PIXI.Point;
  color?: number;
  alpha?: number;
  r?: number;
  sprite?: PIXI.Sprite;
}
