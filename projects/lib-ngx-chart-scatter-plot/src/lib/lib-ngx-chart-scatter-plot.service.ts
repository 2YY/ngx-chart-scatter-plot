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
    if (!this.isPanning) {
      // TODO: implement
    }
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
        deltaScreen.x = e.deltaX;
        deltaScreen.y = e.deltaY;
      } else if (e.type === 'mousemove') {
        deltaScreen.x = (e.screenX - this.panStartCursorScreenPos.x);
        deltaScreen.y = (e.screenY - this.panStartCursorScreenPos.y);
      }

      const pointA = this.panStartMatTransform.applyInverse(this.panStartCursorScreenPos);
      const pointB = this.panStartMatTransform.applyInverse(new PIXI.Point(e.screenX, e.screenY));
      const diff = new PIXI.Point(
        -(pointB.x - pointA.x) * this.panStartMatTransformToggleOrigin.a,
        -(pointB.y - pointA.y) * this.panStartMatTransformToggleOrigin.d
      );

      return new PIXI.Rectangle(
        this.panStartCamera.x + diff.x,
        this.panStartCamera.y + diff.y,
        this.panStartCamera.width + diff.x,
        this.panStartCamera.height + diff.y
      );
    }
    return camera;
  }

  panEnd() {
    this.isPanning = false;
  }

}
