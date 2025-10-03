import { vec2 } from '@basementuniverse/vec';
import Game from './Game';
import SceneManager, { Scene, SceneTransitionState } from '@basementuniverse/scene-manager';
import ContentManager from '@basementuniverse/content-manager';
import * as constants from './constants';
import * as content from '../content/content.json';
import { MenuScene } from './MenuScene';

export class LoadingScene extends Scene {
  private static readonly TRANSITION_TIME: number = 0.5;

  private static readonly COOLDOWN_TIME: number = 2.5;

  private finishedLoadingContent: boolean;

  private progressBar: {
    position: vec2;
    progress: number;
  };

  private cooldownTime: number = 0;

  public constructor() {
    super({
      transitionTime: LoadingScene.TRANSITION_TIME,
    });
  }

  public initialise() {
    this.finishedLoadingContent = false;
    this.progressBar = { position: vec2(), progress: 0 };
    this.cooldownTime = LoadingScene.COOLDOWN_TIME;

    ContentManager.load(content).then(() => {
      this.finishedLoadingContent = true;
    }).catch((error: string) => {
      constants.DEBUG && console.log(`Unable to load content: ${error}`);
    });
  }

  public update(dt: number) {
    this.progressBar.position = vec2.map(vec2.div(Game.screen, 2), Math.floor);
    this.progressBar.progress = ContentManager.progress;
    if (this.finishedLoadingContent) {
      this.cooldownTime -= dt;
    }

    if (this.cooldownTime <= 0) {
      SceneManager.pop();
      SceneManager.push(new MenuScene());
    }
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();
    if (this.transitionState !== SceneTransitionState.None) {
      context.globalAlpha = this.transitionAmount;
    }
    context.fillStyle = 'white';
    context.fillRect(
      this.progressBar.position.x,
      this.progressBar.position.y,
      this.progressBar.progress * 100,
      20
    );
    context.restore();
  }
}
