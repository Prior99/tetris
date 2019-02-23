import * as React from "react";
import { external, inject } from "tsdi";
import { GameState } from "game";
import { observer } from "mobx-react";
import * as css from "./info.scss";

@external @observer
export class Info extends React.Component {
    @inject private gameState: GameState;

    public render() {
        return (
            <div className={css.info}>
                <p>Score: {this.gameState.score}</p>
                <p>Line: {this.gameState.lines}</p>
                <p>Level: {this.gameState.level}</p>
            </div>
        );
    }
}
