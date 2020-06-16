export * from '@pixi/constants';
export * from '@pixi/math';
export * from '@pixi/runner';
export * from '@pixi/settings';
export * from '@pixi/ticker';
import * as utils from '@pixi/utils';
// Renderer plugins
import {BatchRenderer, Renderer} from '@pixi/core';
// Application plugins
import {Application} from '@pixi/app';
import {TickerPlugin} from '@pixi/ticker';




export {utils};
export * from '@pixi/display';
export * from '@pixi/core';
export * from '@pixi/sprite';
export * from '@pixi/app';
export * from '@pixi/graphics';

Renderer.registerPlugin('batch', BatchRenderer);

Application.registerPlugin(TickerPlugin);
