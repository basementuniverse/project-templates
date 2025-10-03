import Game from './Game';
import SceneManager, { Scene, SceneTransitionState } from '@basementuniverse/scene-manager';
import InputManager from '@basementuniverse/input-manager';
import {
  Scene as Scene3D,
  Color,
  Mesh,
  BoxBufferGeometry,
  PerspectiveCamera,
  WebGLRenderer,
  MeshStandardMaterial,
  AmbientLight,
  PointLight,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class GameScene extends Scene {
  private static readonly TRANSITION_TIME: number = 1;

  private scene: Scene3D;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private controls: OrbitControls;
  private cube: Mesh;
  private ambientLight: AmbientLight;
  private pointLight: PointLight;

  public constructor() {
    super({
      transitionTime: GameScene.TRANSITION_TIME,
    });
  }

  public initialise() {
    this.scene = new Scene3D();
    this.scene.background = new Color('#333');

    const aspect = Game.screen.x / Game.screen.y;
    this.camera = new PerspectiveCamera(50, aspect, 1, 1000);
    this.camera.position.z = 700;

    this.renderer = new WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(Game.screen.x, Game.screen.y);
    this.renderer.render(this.scene, this.camera);

    this.controls = new OrbitControls(this.camera, Game.canvas);
    this.controls.update();

    this.cube = this.createCubeMesh();
    this.scene.add(this.cube);

    this.ambientLight = new AmbientLight(0xffffff, 0.3);
    this.scene.add(this.ambientLight);

    this.pointLight = new PointLight(0xffffff, 0.8);
    this.pointLight.position.set(-300, 300, 100);
    this.scene.add(this.pointLight);
  }

  private createCubeMesh() {
    const geometry = new BoxBufferGeometry(200, 200, 200);
    const material = new MeshStandardMaterial();
    const mesh = new Mesh(geometry, material);

    return mesh;
  }

  public update(dt: number) {
    if (InputManager.keyPressed('Escape')) {
      SceneManager.pop();
    }

    this.cube.rotation.x += 0.005;
    this.cube.rotation.y += 0.001;

    this.controls.update();
  }

  public draw(context: CanvasRenderingContext2D) {
    context.save();
    if (this.transitionState !== SceneTransitionState.None) {
      context.globalAlpha = this.transitionAmount;
    }

    this.renderer.render(this.scene, this.camera);

    context.drawImage(
      this.renderer.domElement,
      0,
      0,
      Game.screen.x,
      Game.screen.y
    );

    context.restore();
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
