import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { OwnGameCanvas } from "./own-game-canvas";
import { Info } from "./info";
import * as css from "./single-player.scss";
import { Sounds } from "audio";
import { GameState, ShuffleBag } from "game";
import { Input } from "input";
import { UI, GameMode } from "ui";
import { TetriminoPreviews } from "./tetrimino-previews";

@external @observer
export class SinglePlayer extends React.Component {
    @inject private sounds: Sounds;
    @inject private shuffleBag: ShuffleBag;
    @inject private gameState: GameState;
    @inject private input: Input;
    @inject private ui: UI;

    @initialize protected initialize() {
        this.sounds.startGame();
        this.shuffleBag.seed();
        this.gameState.start();
        this.input.enable();
        this.ui.gameMode = GameMode.SINGLE_PLAYER;
    }

    public render() {
        return (
            <section className={css.game}>
                <div className={css.wrapper}>
                    <Info />
                    <OwnGameCanvas />
                    <TetriminoPreviews />
                </div>
            </section>
        );
    }
}
