import * as React from "react";
import { external, inject } from "tsdi";
import { ObservableGame } from "observable-game";
import { IncomingGabage } from "./incoming-garbage";
import { observer } from "mobx-react";
import * as css from "./info.scss";
import { TetriminoPreview } from "./tetrimino-preview";

function prefix(str: string, value: string, width: number): string {
    while (str.length < width) {
        str = `${value}${str}`;
    }
    return str;
}

@external @observer
export class Info extends React.Component {
    @inject private game: ObservableGame;

    public render() {
        return (
            <div className={css.info}>
                <div className={css.holdPiece}>
                    {
                        this.game.holdPiece
                            ? <TetriminoPreview size={0.7} matrix={this.game.holdPiece} />
                            : <></>
                    }
                </div>
                <div className={css.score}>
                    <div className={css.label}>
                        Score
                    </div>
                    <div className={css.value}>
                        {prefix(`${this.game.score}`, "0", 8)}
                    </div>
                </div>
                <div className={css.lines}>
                    <div className={css.label}>
                        Lines
                    </div>
                    <div className={css.value}>
                        {this.game.lines}
                    </div>
                </div>
                <div className={css.level}>
                    <div className={css.label}>
                        Level
                    </div>
                    <div className={css.value}>
                        {this.game.level}
                    </div>
                </div>
                {
                    this.game.incomingGarbage.length > 0 ? (
                        <div className={css.garbage}>
                            <div className={css.label}>
                                Incoming
                            </div>
                            <div className={css.value}>
                                {this.game.incomingGarbage.map(garbage => <IncomingGabage garbage={garbage} />)}
                            </div>
                        </div>
                    ) : <></>
                }
            </div>
        );
    }
}
