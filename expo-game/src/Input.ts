import { vec2 } from '@basementuniverse/vec';

type TouchState = {
  touching: boolean;
  position: vec2;
};

export default class Input {
  private static instance: Input;

  private state: TouchState = Input.initialiseState();
  private previousState: TouchState = Input.initialiseState();

  private constructor(private pixelRatio: number) {}

  public static initialise(pixelRatio: number) {
    Input.instance = new Input(pixelRatio);

    return Input.instance;
  }

  private static getInstance(): Input {
    if (Input.instance === undefined) {
      throw new Error('Input not initialised');
    }

    return Input.instance;
  }

  private static initialiseState(): TouchState {
    return { touching: false, position: vec2() };
  }

  private static copyState(state: TouchState): TouchState {
    return { touching: state.touching, position: vec2.cpy(state.position) };
  }

  public handleTouchStart(p: vec2) {
    const instance = Input.getInstance();

    instance.state.touching = true;
    instance.state.position = vec2.mul(p, instance.pixelRatio);
  }

  public handleTouchMove(p: vec2) {
    const instance = Input.getInstance();

    instance.state.position = vec2.mul(p, instance.pixelRatio);
  }

  public handleTouchEnd() {
    const instance = Input.getInstance();

    instance.state.touching = false;
  }

  public static update() {
    const instance = Input.getInstance();

    instance.previousState = this.copyState(instance.state);
  }

  public static touchDown(): boolean {
    const instance = Input.getInstance();

    return instance.state.touching;
  }

  public static touchPressed(): boolean {
    const instance = Input.getInstance();

    return instance.state.touching && !instance.previousState.touching;
  }

  public static touchReleased(): boolean {
    const instance = Input.getInstance();

    return !instance.state.touching && instance.previousState.touching;
  }

  public static touchPosition(): vec2 {
    const instance = Input.getInstance();

    return instance.state.position;
  }
}
