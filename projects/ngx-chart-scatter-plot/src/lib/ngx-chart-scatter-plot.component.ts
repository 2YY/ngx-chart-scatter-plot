import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import * as PIXI from './pixi.js';
import {Plot} from './plot';
import {ChartOptions} from './chart-options';
import {NgxChartScatterPlotService} from './ngx-chart-scatter-plot.service';


@Component({
  selector: 'lib-ngx-chart-scatter-plot',
  templateUrl: './ngx-chart-scatter-plot.component.html',
  styleUrls: ['./ngx-chart-scatter-plot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxChartScatterPlotComponent implements AfterViewInit {

  @ViewChild('containerChart') containerChartRef: ElementRef;

  @Output() pointerdownPlot = new EventEmitter<Plot>();
  @Output() pointerupPlot = new EventEmitter<Plot>();
  @Output() pointerupoutsidePlot = new EventEmitter<Plot>();
  @Output() pointeroverPlot = new EventEmitter<Plot>();
  @Output() pointeroutPlot = new EventEmitter<Plot>();

  ticks: PIXI.Point[] = [];
  isPointerOverlappingAnyPlot = false;

  private optionsRef: ChartOptions;
  private app: PIXI.Application;
  private cameraRect: PIXI.Rectangle;
  private cameraRectDefault: PIXI.Rectangle;
  private plotDisplayObjectArr: PIXI.DisplayObject[] = [];
  private plotDataArr: Plot[];
  private matTransform: PIXI.Matrix;
  private matTransformsToggleOrigin = { // NOTE: tx and ty is flag. (it's not pan amount. see updateMatTransformArr method.)
    leftTop: new PIXI.Matrix(1, 0, 0, 1, 0, 0),
    leftBottom: new PIXI.Matrix(1, 0, 0, -1, 0, 1),
    rightBottom: new PIXI.Matrix(-1, 0, 0, -1, 1, 1),
    rightTop: new PIXI.Matrix(-1, 0, 0, 1, 1, 0)
  };
  private cursor = new PIXI.Point(.5, .5);
  private hoge = 'fuga';

  constructor(
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private chartScatterPlotService: NgxChartScatterPlotService
  ) {
  }

  /**
   * Array that individual plot data
   */
  @Input() set plots(arr: Plot[]) {
    this.plotDataArr = arr;

    if (this.isReadyForDrawing()) {
      this.draw();
    }
  }

  /**
   * in World Coords.
   * the width and height will regarded as absolute coords diagonal from origin in world coords for convenience.
   */
  @Input() set camera(rect: PIXI.Rectangle) {
    this.cameraRect = rect;
    if (!this.cameraRectDefault) {
      this.cameraRectDefault = rect.clone();
    }
    if (this.isReadyForDrawing()) {
      this.updateMatTransform();
      this.draw();
    }
  }

  @Input() set options(o: ChartOptions) {
    if (!o.origin) {
      o.origin = 'leftTop';
    }
    this.optionsRef = o;
    if (this.isReadyForDrawing()) {
      this.updateMatTransform();
      this.draw();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.zone.runOutsideAngular(() => {
        this.app = new PIXI.Application({
          antialias: true,
          transparent: true,
          resolution: window.devicePixelRatio || 1,
          resizeTo: this.containerChartRef.nativeElement
        });
        this.app.view.style['max-width'] = '100%';
        this.app.view.style['max-height'] = '100%';
        this.containerChartRef.nativeElement.appendChild(this.app.view);
        this.updateMatTransform();
        this.draw();
      });
    }, 10);
  }

  getMatTransform() {
    return this.matTransform.clone();
  }

  getMatTransformToggleOrigin() {
    return this.matTransformsToggleOrigin[this.optionsRef.origin].clone();
  }

  getCursorPos() {
    return this.cursor;
  }

  updateCursor(e: MouseEvent) {
    if (this.containerChartRef.nativeElement) {
      const cursor = new PIXI.Point(
        e.offsetX - this.optionsRef.invisibleWallMargin,
        e.offsetY - this.optionsRef.invisibleWallMargin
      );
      if (this.optionsRef.invisibleWallMargin >= cursor.x) {
        cursor.x = 0;
      }
      if (this.optionsRef.invisibleWallMargin >= cursor.y) {
        cursor.y = 0;
      }
      const rate = new PIXI.Point(
        cursor.x / (this.containerChartRef.nativeElement.clientWidth - this.optionsRef.invisibleWallMargin * 2),
        cursor.y / (this.containerChartRef.nativeElement.clientHeight - this.optionsRef.invisibleWallMargin * 2)
      );
      this.cursor.x = this.matTransformsToggleOrigin[this.optionsRef.origin].a > 0 ? rate.x : 1 - rate.x;
      this.cursor.y = this.matTransformsToggleOrigin[this.optionsRef.origin].d > 0 ? rate.y : 1 - rate.y;
    }
  }

  updateCollision(e: MouseEvent) {
    let isHit = false;
    const canvasSize = new PIXI.Point(this.containerChartRef.nativeElement.clientWidth, this.containerChartRef.nativeElement.clientHeight);
    const cursorPos = new PIXI.Point(e.offsetX, e.offsetY);
    const mortonNumber = this.chartScatterPlotService.getMortonNumber(canvasSize, cursorPos);
    const sameMortonNumberPlots = this.plotDataArr
      .filter(v => this.isInScreenPlot(v))
      .map(v => ({r: v.r, position: this.matTransform.apply(v.position)}))
      .filter(v => mortonNumber === this.chartScatterPlotService.getMortonNumber(canvasSize, v.position));
    sameMortonNumberPlots.reverse();
    sameMortonNumberPlots.forEach((v, i) => {
      if (!isHit && v.r >= Math.sqrt(Math.pow(cursorPos.x - v.position.x, 2) + Math.pow(cursorPos.y - v.position.y, 2))) {
        isHit = true;
        this.isPointerOverlappingAnyPlot = true;
      }
    });
    if (!isHit) {
      this.isPointerOverlappingAnyPlot = false;
    }
  }

  trackByIndex(i: number) {
    return i;
  }

  private isInScreenPlot(plot: Plot) {
    const p = this.matTransform.apply(plot.position);
    let w: number;
    let h: number;
    if (plot.sprite) {
      w = plot.sprite.width;
      h = plot.sprite.height;
    } else {
      w = plot.r * 2;
      h = plot.r * 2;
    }
    return p.x > -w / 2
      && this.containerChartRef.nativeElement.clientWidth + w / 2 > p.x
      && p.y > -h / 2
      && this.containerChartRef.nativeElement.clientHeight + h / 2 > p.y;
  }

  private isReadyForDrawing() {
    return this.app && this.plotDataArr && this.optionsRef && this.cameraRect && this.containerChartRef.nativeElement;
  }

  private draw() {
    // Remove all plots from chart
    this.plotDisplayObjectArr.forEach(v => this.app.stage.removeChild(v));
    this.plotDisplayObjectArr = [];

    // Add all Plots to chart
    this.plotDataArr.forEach(plot => {
      const p = this.matTransform.apply(plot.position);
      const isPlotInTheCameraBounds = this.isInScreenPlot(plot);
      if (isPlotInTheCameraBounds) {
        if (plot.sprite) {
          // TODO: implement
        } else {
          const g = new PIXI.Graphics();
          g.lineStyle(0);
          g.beginFill(plot.color, plot.alpha);
          g.drawCircle(p.x, p.y, plot.r);
          g.endFill();
          g.interactive = true;
          g.buttonMode = true;
          this.app.stage.addChild(g);
          this.plotDisplayObjectArr.push(g);
        }
      }
    });

    // Update all ticks
    const cameraSizeDefault = new PIXI.Point(
      this.cameraRectDefault.width - this.cameraRectDefault.x,
      this.cameraRectDefault.height - this.cameraRectDefault.y
    );
    const cameraSizeCurrent = new PIXI.Point(
      this.cameraRect.width - this.cameraRect.x,
      this.cameraRect.height - this.cameraRect.y
    );
    const scale = new PIXI.Point(
      cameraSizeDefault.x / cameraSizeCurrent.x,
      cameraSizeDefault.y / cameraSizeCurrent.y
    );
    const calcTickAmount = (factor = 3, exponent = 2) => { // FIXME: Can I depict this function as single formula? (to improve performance)
      if (1 / (factor / 4) >= scale.x) {
        return Math.pow(2, exponent) + 1;
      }
      return calcTickAmount(factor / 2, exponent + 1);
    };
    const tickAmount = calcTickAmount();
    this.ticks = ' '.repeat(tickAmount).split('').map((v, i) => this.matTransform.apply(new PIXI.Point(
      this.cameraRectDefault.x + cameraSizeDefault.x / (tickAmount - 1) * i,
      this.cameraRectDefault.y + cameraSizeDefault.y / (tickAmount - 1) * i
    )));
    this.changeDetectorRef.detectChanges();
  }

  private updateMatTransform() {
    const vW = this.containerChartRef.nativeElement.clientWidth - this.optionsRef.invisibleWallMargin * 2;
    const vH = this.containerChartRef.nativeElement.clientHeight - this.optionsRef.invisibleWallMargin * 2;
    const cX = this.cameraRect.x;
    const cY = this.cameraRect.y;
    const cW = this.cameraRect.width - cX;
    const cH = this.cameraRect.height - cY;

    this.matTransform = new PIXI.Matrix().set( // NOTE: mat transform that world coords to screen coords.
      vW / cW, // NOTE: x scaling
      0,
      0,
      vH / cH, // NOTE: y scaling
      -cX * (vW / cW), // NOTE: x panning
      -cY * (vH / cH) // NOTE: y panning
    );

    this.matTransform.prepend(new PIXI.Matrix().set(
      this.matTransformsToggleOrigin[this.optionsRef.origin].a,
      this.matTransformsToggleOrigin[this.optionsRef.origin].b,
      this.matTransformsToggleOrigin[this.optionsRef.origin].c,
      this.matTransformsToggleOrigin[this.optionsRef.origin].d,
      this.matTransformsToggleOrigin[this.optionsRef.origin].tx * this.containerChartRef.nativeElement.clientWidth,
      this.matTransformsToggleOrigin[this.optionsRef.origin].ty * this.containerChartRef.nativeElement.clientHeight
    ));

    this.matTransform.prepend(new PIXI.Matrix().set(
      1,
      0,
      0,
      1,
      this.optionsRef.invisibleWallMargin * this.matTransformsToggleOrigin[this.optionsRef.origin].a,
      this.optionsRef.invisibleWallMargin * this.matTransformsToggleOrigin[this.optionsRef.origin].d
    ));
  }

}
