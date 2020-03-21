import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild} from '@angular/core';
import * as PIXI from './pixi.js';
import {Plot} from './plot';
import {LibNgxChartScatterPlotOptions} from './lib-ngx-chart-scatter-plot-options';

@Component({
  selector: 'lib-ngx-chart-scatter-plot',
  templateUrl: './lib-ngx-chart-scatter-plot.component.html',
  styleUrls: ['./lib-ngx-chart-scatter-plot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibNgxChartScatterPlotComponent implements AfterViewInit {

  @ViewChild('containerChart') containerChartRef: ElementRef;

  /** Array that individual plot data */
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
    if (this.isReadyForDrawing()) {
      this.updateMatTransformArr();
      this.draw();
    }
  }

  @Input() set options(o: LibNgxChartScatterPlotOptions) {
    if (!o.origin) { o.origin = 'leftTop'; }
    this.optionsRef = o;
    if (this.isReadyForDrawing()) {
      this.updateMatTransformArr();
      this.draw();
    }
  }

  @Output() pointerdownPlot = new EventEmitter<Plot>();
  @Output() pointerupPlot = new EventEmitter<Plot>();
  @Output() pointerupoutsidePlot = new EventEmitter<Plot>();
  @Output() pointeroverPlot = new EventEmitter<Plot>();
  @Output() pointeroutPlot = new EventEmitter<Plot>();
  @Output() mousedownPlot = new EventEmitter<Plot>();
  @Output() mouseupPlot = new EventEmitter<Plot>();
  @Output() mouseupoutsidePlot = new EventEmitter<Plot>();
  @Output() mouseoverPlot = new EventEmitter<Plot>();
  @Output() mouseoutPlot = new EventEmitter<Plot>();
  @Output() touchstartPlot = new EventEmitter<Plot>();
  @Output() touchendPlot = new EventEmitter<Plot>();
  @Output() touchendoutsidePlot = new EventEmitter<Plot>();

  private optionsRef: LibNgxChartScatterPlotOptions;

  private app: PIXI.Application;
  private cameraRect: PIXI.Rectangle;

  private plotDisplayObjectArr: PIXI.DisplayObject[] = [];
  private plotDataArr: Plot[];

  private matTransform: PIXI.Matrix;
  private matTransformsToggleOrigin = {
    leftTop:     new PIXI.Matrix(1, 0, 0, 1, 0, 0),
    leftBottom:  new PIXI.Matrix(1,  0, 0, -1, 0, 0),
    rightBottom: new PIXI.Matrix(-1, 0, 0, -1, 0, 0),
    rightTop:    new PIXI.Matrix(-1, 0, 0,  1, 0, 0)
  };

  constructor(private zone: NgZone) {}

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
        this.updateMatTransformArr();
        this.draw();
      });
    }, 10);
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
      const isPlotInTheCameraBounds = (() => {
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
      })();
      if (isPlotInTheCameraBounds) {
        if (plot.sprite) {
          //
        } else {
          const g = new PIXI.Graphics();
          g.lineStyle(0);
          g.beginFill(plot.color, plot.alpha);
          g.drawCircle(p.x, p.y, plot.r);
          g.endFill();
          g.interactive = true;
          g.buttonMode = true;
          g.on('pointerdown', () => this.pointerdownPlot.emit(plot));
          g.on('pointerup', () => this.pointerupPlot.emit(plot));
          g.on('pointerupoutside', () => this.pointerupoutsidePlot.emit(plot));
          g.on('pointerover', () => this.pointeroverPlot.emit(plot));
          g.on('pointerout', () => this.pointeroutPlot.emit(plot));
          g.on('mousedown', () => this.mousedownPlot.emit(plot));
          g.on('mouseup', () => this.mouseupPlot.emit(plot));
          g.on('mouseupoutside', () => this.mouseupoutsidePlot.emit(plot));
          g.on('mouseover', () => this.mouseoverPlot.emit(plot));
          g.on('mouseout', () => this.mouseoutPlot.emit(plot));
          g.on('touchstart', () => this.touchstartPlot.emit(plot));
          g.on('touchend', () => this.touchendPlot.emit(plot));
          g.on('touchendoutside', () => this.touchendoutsidePlot.emit(plot));
          this.app.stage.addChild(g);
          this.plotDisplayObjectArr.push(g);
        }
      }
    });
  }

  private updateMatTransformArr() {
    const vW = this.containerChartRef.nativeElement.clientWidth;
    const vH = this.containerChartRef.nativeElement.clientHeight;
    const cX = this.cameraRect.x;
    const cY = this.cameraRect.y;
    const cW = this.cameraRect.width - cX;
    const cH = this.cameraRect.height - cY;

    this.matTransform = new PIXI.Matrix().set( // NOTE: mat transform world that coords to screen coords.
      vW / cW, // NOTE: x scaling
      0,
      0,
      vH / cH, // NOTE: y scaling
      -cX * (vW / cW), // NOTE: x panning
      -cY * (vH / cH) // NOTE: y panning
    );
    if (this.optionsRef.origin !== 'leftTop') {
      this.matTransform.append(this.matTransformsToggleOrigin[this.optionsRef.origin]);
    }
  }

  getMatTransform() {
    return this.matTransform.clone();
  }

  getMatTransformToggleOrigin() {
    return this.matTransformsToggleOrigin[this.optionsRef.origin].clone();
  }

}
