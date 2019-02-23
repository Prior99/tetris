import * as React from "react";
import { GameCanvas } from "./game-canvas";
import { Info } from "./info";
import * as css from "./game.scss";

export class Game extends React.Component {
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
