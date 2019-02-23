import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { GameCanvas } from "./game-canvas";
import { Info } from "./info";
import * as css from "./single-player.scss";
import { Sounds } from "audio";

@external @observer
export class SinglePlayer extends React.Component {
    @inject private sounds: Sounds;

    @initialize protected initialize() {
        this.sounds.startGame();
    }

    public render() {
        return (
            <section className={css.game}>
                <div className={css.wrapper}>
                    <GameCanvas />
                    <Info />
                </div>
            </section>
        );
    }
}
