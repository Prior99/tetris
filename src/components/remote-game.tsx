import * as React from "react";
import { computed } from "mobx";
import { external, inject } from "tsdi";
import { GameOverReason } from "types";
import classNames from "classnames/bind";
import { observer } from "mobx-react";
import { Networking } from "networking";
import { RemoteGameCanvas } from "./remote-game-canvas";
import * as css from "./remote-game.scss";

const cx = classNames.bind(css);

@external @observer
export class RemoteGame extends React.Component<{ userId: string }> {
    @inject private networking: Networking;

    @computed private get isWinner() {
        return this.networking.winner && this.networking.winner.userId === this.props.userId;
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
                            <div className={css.gameOverStats}>
                                <div className={css.info}>
                                    <div className={css.label}>Score</div>
                                    <div className={css.value}>{state.score}</div>
                                </div>
                                <div className={css.info}>
                                    <div className={css.label}>Lines</div>
                                    <div className={css.value}>{state.lines}</div>
                                </div>
                                <div className={css.info}>
                                    <div className={css.label}>Level</div>
                                    <div className={css.value}>{state.level}</div>
                                </div>
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
            <section className={css.remoteGame}>
                <div className={css.headline}>{this.networking.userById(userId)!.name}</div>
                {this.renderCanvas()}
            </section>
        );
    }
}
