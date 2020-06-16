import * as PIXI from './pixi';

export interface Plot {
  /** unique id */
  id: string;

  /**
   * Plot position.
   */
  position: PIXI.Point;

  /**
   * Plot color.
   */
  color?: number;

  /**
   * Plot opacity.
   */
  alpha?: number;

  /**
   * Plot radius.
   */
  r?: number;

  /**
   * Plot sprite.
   */
  sprite?: PIXI.Sprite;
}
