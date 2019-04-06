import * as React from "react";
import { external, inject } from "tsdi";
import { Segment, Statistic } from "semantic-ui-react";
import classNames from "classnames/bind";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { ObservableGame } from "observable-game";
import { formatSeconds, prefix } from "utils";
import { IncomingGabage } from "../incoming-garbage";
import { TetriminoPreview } from "../tetrimino-preview";
import * as css from "./info.scss";
import { DropsPerMinuteHistory } from "../drops-per-minute-history";

const cx = classNames.bind(css);

@external @observer
export class Info extends React.Component {
    @inject private game: ObservableGame;

    @computed private get time() {
        return formatSeconds(this.game.seconds);
    }

    public render() {
        return (
            <div className={css.info}>
                {
                    this.game.holdPiece && (
                        <Segment className={cx("infoItem", "holdPiece")}>
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
                <Segment className={css.infoItem}>
                    <Statistic size="mini">
                        <Statistic.Label>Time</Statistic.Label>
                        <Statistic.Value>{this.time}</Statistic.Value>
                    </Statistic>
                </Segment>
                <Segment className={css.infoItem} style={{ height: 80 }}>
                    <DropsPerMinuteHistory />
                </Segment>
                {
                    this.game.incomingGarbage.length > 0 && (
                        <Segment>
                            <div className={css.value}>
                                {
                                    this.game.incomingGarbage.map((garbage, index) => {
                                        return <IncomingGabage key={index} garbage={garbage} />;
                                    })
                                }
                            </div>
                        </Segment>
                    )
                }
            </div>
        );
    }
}
