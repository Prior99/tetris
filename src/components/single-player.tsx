import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { Sounds } from "sounds";
import { ObservableGame } from "observable-game";
import { UI } from "ui";
import { GameMode } from "types";
import { TetriminoPreviews } from "./tetrimino-previews";
import { OwnGameCanvas } from "./own-game-canvas";
import { Info } from "./info";
import * as css from "./single-player.scss";

@external @observer
export class SinglePlayer extends React.Component {
    @inject private game: ObservableGame;
    @inject private ui: UI;

    @initialize protected initialize() {
        this.game.start(GameMode.SINGLE_PLAYER);
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
