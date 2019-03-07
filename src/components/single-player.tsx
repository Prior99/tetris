import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { ObservableGame } from "observable-game";
import { GameMode } from "types";
import { TetriminoPreviews } from "./tetrimino-previews";
import { GameCanvas } from "./game-canvas";
import { Info } from "./info";
import * as css from "./single-player.scss";

@external @observer
export class SinglePlayer extends React.Component {
    @inject private game: ObservableGame;

    @initialize protected initialize() {
        this.game.start(GameMode.SINGLE_PLAYER);
    }

    public render() {
        return (
            <section className={css.game}>
                <div className={css.wrapper}>
                    <Info />
                    <GameCanvas />
                    <TetriminoPreviews />
                </div>
            </section>
        );
    }
}
