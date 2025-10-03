import { randomBetween } from '@basementuniverse/utils';
import { vec2 } from '@basementuniverse/vec';
import Expo2DContext from 'expo-2d-context';
import config from '../game.json';
import * as constants from './constants';
import Debug from './Debug';
import Input from './Input';

export default class Game {
  private lastFrameTime: number;

  private lastFrameCountTime: number;

  private frameRate: number = 0;

  private frameCount: number = 0;

  public static screen: vec2;

  public static pixelRatio: number;

  private actors: { p: vec2; v: vec2; d: boolean }[] = [];

  public constructor(public context: Expo2DContext, pixelRatio: number) {
    this.lastFrameTime = this.lastFrameCountTime = performance.now();
    Game.pixelRatio = pixelRatio;
  }

  public initialise() {
    Debug.initialise({
      lineMargin: 5,
    });

    // Initialisation code here...
  }

  public loop() {
    const now = performance.now();
    const elapsedTime = Math.min(now - this.lastFrameTime, constants.FPS_MIN);

    // Calculate framerate
    if (now - this.lastFrameCountTime >= 1000) {
      this.lastFrameCountTime = now;
      this.frameRate = this.frameCount;
      this.frameCount = 0;
    }
    this.frameCount++;
    this.lastFrameTime = now;

    // Show framerate
    if (config.showFPS) {
      Debug.value('FPS', this.frameRate, { align: 'right' });
      Debug.chart('FPS', this.frameRate, { minValue: 0, maxValue: 70 });
    }

    Game.screen = vec2(this.context.width, this.context.height);
    Input.update();

    // Do game loop
    this.update(elapsedTime * 1000);
    this.draw();
  }

  private update(dt: number) {
    // Update code here...

    if (Input.touchDown()) {
      this.actors.push({
        p: Input.touchPosition(),
        v: vec2(randomBetween(-1, 1), randomBetween(-1, 1)),
        d: false,
      });
    }

    for (const actor of this.actors) {
      actor.p = vec2.add(actor.p, vec2.mul(actor.v, dt));

      if (
        actor.p.x < 0 ||
        actor.p.x > Game.screen.x ||
        actor.p.y < 0 ||
        actor.p.y > Game.screen.y
      ) {
        actor.d = true;
      }
    }

    this.actors = this.actors.filter(a => a.d === false);
  }

  private draw() {
    this.context.clearRect(0, 0, Game.screen.x + 10, Game.screen.y + 10);

    // Draw code here...
    this.context.fillStyle = 'white';
    for (const actor of this.actors) {
      this.context.beginPath();
      this.context.arc(actor.p.x, actor.p.y, 5, 0, Math.PI * 2);
      this.context.fill();
    }

    // Render debug output
    Debug.draw(this.context, Game.screen);

    // Send the rendered frame to the screen
    this.context.flush();
  }
}
