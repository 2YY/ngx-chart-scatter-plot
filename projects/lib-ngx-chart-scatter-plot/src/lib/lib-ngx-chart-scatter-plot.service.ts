import * as PIXI from './pixi.js';
import { Injectable } from '@angular/core';
import {LibNgxChartScatterPlotOptions} from './lib-ngx-chart-scatter-plot-options';

@Injectable({
  providedIn: 'root'
})
export class LibNgxChartScatterPlotService {

  private isPanning = false;
  private panStartCursorScreenPos: PIXI.Point;
  private panStartCamera: PIXI.Rectangle;
  private panStartMatTransform: PIXI.Matrix;
  private panStartMatTransformToggleOrigin: PIXI.Matrix;

  private static moveRelative(to: PIXI.Point, rect: PIXI.Rectangle) {
    rect.x += to.x;
    rect.y += to.y;
    rect.width += to.x;
    rect.height += to.y;
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

  panMove(e: any, camera: PIXI.Rectangle, options: LibNgxChartScatterPlotOptions) {
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

      const result = new PIXI.Rectangle(
        this.panStartCamera.x + diff.x,
        this.panStartCamera.y + diff.y,
        this.panStartCamera.width + diff.x,
        this.panStartCamera.height + diff.y
      );

      const outOfBoundsAmo = new PIXI.Rectangle(
        options.invisibleWall.x - result.x,
        options.invisibleWall.y - result.y,
        result.width - options.invisibleWall.width,
        result.height - options.invisibleWall.height
      );

      if (outOfBoundsAmo.x > 0) { LibNgxChartScatterPlotService.moveRelative(new PIXI.Point(outOfBoundsAmo.x, 0), result); }
      if (outOfBoundsAmo.y > 0) { LibNgxChartScatterPlotService.moveRelative(new PIXI.Point(0, outOfBoundsAmo.y), result); }
      if (outOfBoundsAmo.width > 0) { LibNgxChartScatterPlotService.moveRelative(new PIXI.Point(-outOfBoundsAmo.width, 0), result); }
      if (outOfBoundsAmo.height > 0) { LibNgxChartScatterPlotService.moveRelative(new PIXI.Point(0, -outOfBoundsAmo.height), result); }

      return result;
    }
    return camera;
  }

  panEnd() {
    this.isPanning = false;
  }

  zoom(e: WheelEvent, camera: PIXI.Rectangle) {

    e.preventDefault();

    if (!this.isPanning) {
      const rate = 1 - e.deltaY * .001;
      const amount = new PIXI.Point(
        (camera.width - camera.x) / rate - (camera.width - camera.x),
        (camera.height - camera.y) / rate - (camera.height - camera.y)
      );

      const result = new PIXI.Rectangle(
        camera.x - amount.x / 2,
        camera.y - amount.y / 2,
        camera.width + amount.x / 2,
        camera.height + amount.y / 2
      );

      return result;
    }

    return camera;
  }

}
