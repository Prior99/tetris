import * as React from "react";
import * as ReactDOM from "react-dom";
import DevTools from "mobx-react-devtools";
import { TSDI } from "tsdi";
import { GameCanvas } from "./game-canvas";
import "./index.scss";
import { FactoryAudioContext } from "./factory-audio-context";
import { SpriteManager } from "./sprite-manager";
import { AudioManager } from "./audio-manager";
import {
    SpriteTetriminoI,
    SpriteTetriminoJ,
    SpriteTetriminoL,
    SpriteTetriminoO,
    SpriteTetriminoS,
    SpriteTetriminoT,
    SpriteTetriminoZ,
} from "./sprites";
import {
    AudioHit,
    AudioLevelUp,
    AudioMoveDown,
    AudioMusic120Bpm,
    AudioMusic130Bpm,
    AudioMusic140Bpm,
    AudioMusic150Bpm,
    AudioMusic160Bpm,
    AudioMusic170Bpm,
    AudioRotate,
    AudioScore1,
    AudioScore2,
    AudioScore3,
    AudioScore4,
} from "./audios";

async function main() {
    // Setup dependency injection.
    const tsdi = new TSDI();
    tsdi.enableComponentScanner();

    const spriteManager = tsdi.get(SpriteManager);
    const audioManager = tsdi.get(AudioManager);

    await tsdi.get(FactoryAudioContext).initialize();
    await Promise.all([
        spriteManager.load(SpriteTetriminoI),
        spriteManager.load(SpriteTetriminoJ),
        spriteManager.load(SpriteTetriminoL),
        spriteManager.load(SpriteTetriminoO),
        spriteManager.load(SpriteTetriminoS),
        spriteManager.load(SpriteTetriminoT),
        spriteManager.load(SpriteTetriminoZ),
        audioManager.load(AudioHit),
        audioManager.load(AudioLevelUp),
        audioManager.load(AudioMoveDown),
        audioManager.load(AudioMusic120Bpm),
        audioManager.load(AudioMusic130Bpm),
        audioManager.load(AudioMusic140Bpm),
        audioManager.load(AudioMusic150Bpm),
        audioManager.load(AudioMusic160Bpm),
        audioManager.load(AudioMusic170Bpm),
        audioManager.load(AudioRotate),
        audioManager.load(AudioScore1),
        audioManager.load(AudioScore2),
        audioManager.load(AudioScore3),
        audioManager.load(AudioScore4),
    ]);

    // Start React.
    ReactDOM.render(
    <>
        <DevTools />
        <GameCanvas />
    </>,
    document.getElementById("root"),
    );
}

main();
