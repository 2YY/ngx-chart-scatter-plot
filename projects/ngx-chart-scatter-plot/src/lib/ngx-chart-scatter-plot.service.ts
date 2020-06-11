import {Injectable} from '@angular/core';
import * as PIXI from './pixi.js';
import {ChartOptions} from './chart-options';

@Injectable({
  providedIn: 'root'
})
export class NgxChartScatterPlotService {

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

  private static getOutOfBoundsAmount(bounds: PIXI.Rectangle, testRect: PIXI.Rectangle) {
    return new PIXI.Rectangle(
      bounds.x - testRect.x,
      bounds.y - testRect.y,
      testRect.width - bounds.width,
      testRect.height - bounds.height
    );
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

  panMove(e: any, camera: PIXI.Rectangle, options: ChartOptions) {
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
        -(pointB.x - pointA.x),
        -(pointB.y - pointA.y)
      );

      const result = new PIXI.Rectangle(
        this.panStartCamera.x + diff.x,
        this.panStartCamera.y + diff.y,
        this.panStartCamera.width + diff.x,
        this.panStartCamera.height + diff.y
      );

      const oobAmount = NgxChartScatterPlotService.getOutOfBoundsAmount(options.invisibleWall, result);
      if (oobAmount.x > 0) {
        NgxChartScatterPlotService.moveRelative(new PIXI.Point(oobAmount.x, 0), result);
      }
      if (oobAmount.y > 0) {
        NgxChartScatterPlotService.moveRelative(new PIXI.Point(0, oobAmount.y), result);
      }
      if (oobAmount.width > 0) {
        NgxChartScatterPlotService.moveRelative(new PIXI.Point(-oobAmount.width, 0), result);
      }
      if (oobAmount.height > 0) {
        NgxChartScatterPlotService.moveRelative(new PIXI.Point(0, -oobAmount.height), result);
      }

      return result;
    }
    return camera;
  }

  panEnd() {
    this.isPanning = false;
  }

  zoom(e: WheelEvent, camera: PIXI.Rectangle, options: ChartOptions, matTransform: PIXI.Matrix, cursorPos: PIXI.Point) {

    e.preventDefault();

    if (!this.isPanning) {
      const rate = 1 - e.deltaY * .001;
      const amount = new PIXI.Point(
        (camera.width - camera.x) / rate - (camera.width - camera.x),
        (camera.height - camera.y) / rate - (camera.height - camera.y)
      );
      let result = new PIXI.Rectangle(
        camera.x - (amount.x / 2 * cursorPos.x),
        camera.y - (amount.y / 2 * cursorPos.y),
        camera.width + (amount.x / 2 * (1 - cursorPos.x)),
        camera.height + (amount.y / 2 * (1 - cursorPos.y))
      );
      if (result.x > result.width || result.y > result.height) { // Note: reset camera to zero position if scale negated
        result = options.invisibleWall.clone();
      }
      const oobAmount = NgxChartScatterPlotService.getOutOfBoundsAmount(options.invisibleWall, result);
      if ((oobAmount.x > 0 && oobAmount.width > 0) || (oobAmount.y > 0 && oobAmount.height > 0)) {
        return options.invisibleWall;
      }
      if (oobAmount.x > 0 && 0 >= oobAmount.width) {
        NgxChartScatterPlotService.moveRelative(new PIXI.Point(oobAmount.x, 0), result);
      } else if (oobAmount.width > 0 && 0 >= oobAmount.x) {
        NgxChartScatterPlotService.moveRelative(new PIXI.Point(-oobAmount.width, 0), result);
      }
      if (oobAmount.y > 0 && 0 >= oobAmount.height) {
        NgxChartScatterPlotService.moveRelative(new PIXI.Point(0, oobAmount.y), result);
      } else if (oobAmount.height > 0 && 0 >= oobAmount.y) {
        NgxChartScatterPlotService.moveRelative(new PIXI.Point(0, -oobAmount.height), result);
      }
      return result;
    }

    return camera;
  }

}
