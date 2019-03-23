import * as React from "react";
import { external, inject } from "tsdi";
import { ObservableGame } from "observable-game";
import { observer } from "mobx-react";
import { IncomingGabage } from "../incoming-garbage";
import { TetriminoPreview } from "../tetrimino-preview";
import * as css from "./info.scss";
import { Segment, Statistic } from "semantic-ui-react";

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
                {
                    this.game.holdPiece && (
                        <Segment className={css.infoItem}>
                            <TetriminoPreview size={0.7} matrix={this.game.holdPiece} />
                        </Segment>
                    )
                }
                <Segment className={css.infoItem}>
                    <Statistic size="mini">
                        <Statistic.Label>Score</Statistic.Label>
                        <Statistic.Value>{prefix(`${this.game.score}`, "0", 8)}</Statistic.Value>
                    </Statistic>
                </Segment>
                <Segment className={css.infoItem}>
                    <Statistic size="mini">
                        <Statistic.Label>Lines</Statistic.Label>
                        <Statistic.Value>{this.game.lines}</Statistic.Value>
                    </Statistic>
                </Segment>
                <Segment className={css.infoItem}>
                    <Statistic size="mini">
                        <Statistic.Label>Level</Statistic.Label>
                        <Statistic.Value>{this.game.level}</Statistic.Value>
                    </Statistic>
                </Segment>
                {
                    this.game.incomingGarbage.length > 0 ? (
                        <Segment>
                            <div className={css.label}>Incoming</div>
                            <div className={css.value}>
                                {
                                    this.game.incomingGarbage.map((garbage, index) => {
                                        return <IncomingGabage key={index} garbage={garbage} />;
                                    })
                                }
                            </div>
                        </Segment>
                    ) : <></>
                }
            </div>
        );
    }
}
