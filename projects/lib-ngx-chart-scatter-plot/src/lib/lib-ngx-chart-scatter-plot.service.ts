import * as PIXI from './pixi.js';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LibNgxChartScatterPlotService {

  private isPanning = false;
  private panStartCursorScreenPos: PIXI.Point;
  private panStartCamera: PIXI.Rectangle;
  private panStartMatTransform: PIXI.Matrix;
  private panStartMatTransformToggleOrigin: PIXI.Matrix;

  zoom(e: WheelEvent, camera: PIXI.Rectangle) {
    console.log(e);
  }

  panStart(e: MouseEvent | TouchEvent, camera: PIXI.Rectangle, matTransform: PIXI.Matrix, matTransformToggleOrigin: PIXI.Matrix) {
    this.isPanning = true;
    this.panStartCamera = camera;
    this.panStartMatTransform = matTransform;
    this.panStartMatTransformToggleOrigin = matTransformToggleOrigin;
    if (e.type === 'touchstart') {
      this.panStartCursorScreenPos = new PIXI.Point(
        (e as TouchEvent).touches[0].screenX,
        (e as TouchEvent).touches[0].screenY
      );
    } else if (e.type === 'mousedown') {
      this.panStartCursorScreenPos = new PIXI.Point(
        (e as MouseEvent).screenX,
        (e as MouseEvent).screenY
      );
    }
  }

  panMove(e: any, camera: PIXI.Rectangle) {
    if (this.isPanning) {
      const deltaScreen = new PIXI.Point(0, 0);
      if (e.type === 'pan') {
        deltaScreen.x = -e.deltaX * this.panStartMatTransformToggleOrigin.a;
        deltaScreen.y = -e.deltaY * this.panStartMatTransformToggleOrigin.d;
      } else if (e.type === 'mousemove') {
        deltaScreen.x = -(e.screenX - this.panStartCursorScreenPos.x) * this.panStartMatTransformToggleOrigin.a;
        deltaScreen.y = -(e.screenY - this.panStartCursorScreenPos.y) * this.panStartMatTransformToggleOrigin.d;
      }
      const deltaWorld = this.panStartMatTransform.applyInverse(deltaScreen);

      console.log(deltaScreen, deltaWorld, new PIXI.Rectangle(
        this.panStartCamera.x + deltaWorld.x,
        this.panStartCamera.y + deltaWorld.y,
        this.panStartCamera.width + deltaWorld.x,
        this.panStartCamera.height + deltaWorld.y
      ));

      return new PIXI.Rectangle(
        this.panStartCamera.x + deltaWorld.x,
        this.panStartCamera.y + deltaWorld.y,
        this.panStartCamera.width + deltaWorld.x,
        this.panStartCamera.height + deltaWorld.y
      );
    }
    return camera;
  }

  panEnd() {
    console.log('--------------------------------------------------');
    this.isPanning = false;
  }

}
