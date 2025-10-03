import { vec2 } from '@basementuniverse/vec';
import Expo2DContext, { Expo2dContextOptions } from 'expo-2d-context';
import { GLView } from 'expo-gl';
import React, { useCallback, useEffect, useRef } from 'react';
import { GestureResponderEvent, PixelRatio, SafeAreaView } from 'react-native';
import config from './game.json';
import Game from './src/Game';
import Input from './src/Input';

const App = (): React.ReactElement => {
  const contextRef = useRef<Expo2DContext | null>(null);
  const pixelRatio = PixelRatio.get();

  const gameRef = useRef<Game | null>(null);
  const inputRef = useRef<Input | null>(null);

  const frameHandle = useRef<number | null>();

  const processNextFrame = useCallback(() => {
    if (
      contextRef.current !== null &&
      gameRef.current !== null &&
      inputRef.current !== null
    ) {
      gameRef.current.loop();
    }
    frameHandle.current = requestAnimationFrame(processNextFrame);
  }, []);

  useEffect(() => {
    frameHandle.current = requestAnimationFrame(processNextFrame);
  }, []);

  const handleTouchPress = (e: GestureResponderEvent): void => {
    if (inputRef.current) {
      inputRef.current.handleTouchStart(
        vec2(e.nativeEvent.locationX, e.nativeEvent.locationY)
      );
    }
  };

  const handleTouchRelease = (e: GestureResponderEvent): void => {
    if (inputRef.current) {
      inputRef.current.handleTouchEnd();
    }
  };

  const handleTouchMove = (e: GestureResponderEvent): void => {
    if (inputRef.current) {
      inputRef.current.handleTouchMove(
        vec2(e.nativeEvent.locationX, e.nativeEvent.locationY)
      );
    }
  };

  const handleSetup = useCallback(async (gl: WebGLRenderingContext) => {
    const context = new Expo2DContext(
      gl as unknown as number,
      undefined as unknown as Expo2dContextOptions
    );
    await context.initializeText();
    contextRef.current = context;

    const game = new Game(context, pixelRatio);
    game.initialise();
    gameRef.current = game;

    const input = Input.initialise(pixelRatio);
    inputRef.current = input;
  }, []);

  return (
    <>
      <SafeAreaView
        style={{ flex: 0, backgroundColor: config.headerBackgroundColor }}
        pointerEvents="none"
      ></SafeAreaView>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: config.footerBackgroundColor }}
      >
        <GLView
          style={{ flex: 1, backgroundColor: 'black' }}
          onContextCreate={handleSetup}
          onStartShouldSetResponder={() => true}
          onResponderGrant={handleTouchPress}
          onResponderRelease={handleTouchRelease}
          onResponderMove={handleTouchMove}
        />
      </SafeAreaView>
    </>
  );
};

export default App;
