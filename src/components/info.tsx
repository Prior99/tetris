import * as React from "react";
import { external, inject } from "tsdi";
import { GameState } from "game";
import { IncomingGabage } from "./incoming-garbage";
import { observer } from "mobx-react";
import * as css from "./info.scss";

function prefix(str: string, value: string, width: number): string {
    while (str.length < width) {
        str = `${value}${str}`;
    }
    return str;
}

@external @observer
export class Info extends React.Component {
    @inject private gameState: GameState;

    public render() {
        return (
            <div className={css.info}>
                <div className={css.score}>
                    <div className={css.label}>
                        Score
                    </div>
                    <div className={css.value}>
                        {prefix(`${this.gameState.score}`, "0", 8)}
                    </div>
                </div>
                <div className={css.lines}>
                    <div className={css.label}>
                        Lines
                    </div>
                    <div className={css.value}>
                        {this.gameState.lines}
                    </div>
                </div>
                <div className={css.level}>
                    <div className={css.label}>
                        Level
                    </div>
                    <div className={css.value}>
                        {this.gameState.level}
                    </div>
                </div>
                {
                    this.gameState.incomingGarbage.length > 0 ? (
                        <div className={css.garbage}>
                            <div className={css.label}>
                                Incoming
                            </div>
                            <div className={css.value}>
                                {this.gameState.incomingGarbage.map(garbage => <IncomingGabage garbage={garbage} />)}
                            </div>
                        </div>
                    ) : <></>
                }
            </div>
        );
    }
}
