import * as React from "react";
import { computed } from "mobx";
import { external, inject } from "tsdi";
import { GameOverReason } from "types";
import classNames from "classnames/bind";
import { observer } from "mobx-react";
import { Networking } from "networking";
import { RemoteGameCanvas } from "../remote-game-canvas";
import * as css from "./remote-game.scss";
import { Segment, Statistic } from "semantic-ui-react";

const cx = classNames.bind(css);

@external @observer
export class RemoteGame extends React.Component<{ userId: string }> {
    @inject private networking: Networking;

    @computed private get isWinner() {
        return this.networking.currentWinners && this.networking.currentWinners.includes(this.props.userId);
    }

    private renderCanvas() {
        const { userId } = this.props;
        const classes = cx({
            gameOver: true,
            winner: this.isWinner,
        });
        const state = this.networking.stateForUser(userId);
        const matrix = this.networking.playfieldForUser(userId);
        if (!state || !matrix || !this.networking.isUserInitialized(userId)) { return <></>; }
        return (
            <RemoteGameCanvas state={state} matrix={matrix}>
                {
                    state.gameOverReason !== GameOverReason.NONE ? (
                        <div className={classes}>
                            <div className={css.gameOverText}>
                                {this.isWinner ? "Winner" : "Game Over"}
                            </div>
                            <div>
                                <Statistic size="mini" className={css.statistic}>
                                    <Statistic.Label>Score</Statistic.Label>
                                    <Statistic.Value>{state.score}</Statistic.Value>
                                </Statistic>
                                <Statistic size="mini" className={css.statistic}>
                                    <Statistic.Label>Lines</Statistic.Label>
                                    <Statistic.Value>{state.lines}</Statistic.Value>
                                </Statistic>
                                <Statistic size="mini" className={css.statistic}>
                                    <Statistic.Label>Level</Statistic.Label>
                                    <Statistic.Value>{state.level}</Statistic.Value>
                                </Statistic>
                            </div>
                        </div>
                    ) : <></>
                }
            </RemoteGameCanvas>
        );
    }

    public render() {
        const { userId } = this.props;
        return (
            <Segment className={css.remoteGame}>
                <h3>{this.networking.userById(userId)!.name}</h3>
                {this.renderCanvas()}
            </Segment>
        );
    }
}
