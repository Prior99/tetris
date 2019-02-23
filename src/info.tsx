import * as React from "react";
import { external, inject } from "tsdi";
import { GameState } from "./game-state";
import { observer } from "mobx-react";

@external @observer
export class Info extends React.Component {
    @inject private gameState: GameState;

    public render() {
        return (
            <div>
                <p>Score: {this.gameState.score}</p>
                <p>Line: {this.gameState.lines}</p>
                <p>Level: {this.gameState.level}</p>
            </div>
        );
    }
}
