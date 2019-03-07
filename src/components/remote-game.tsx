import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { Networking } from "networking";
import { RemoteGameCanvas } from "./remote-game-canvas";
import * as css from "./remote-game.scss";

@external @observer
export class RemoteGame extends React.Component<{ userId: string }> {
    @inject private networking: Networking;

    private renderCanvas() {
        const { userId } = this.props;
        const state = this.networking.stateForUser(userId);
        const matrix = this.networking.playfieldForUser(userId);
        if (!state || !matrix || !this.networking.isUserInitialized(userId)) { return <></>; }
        return (
            <RemoteGameCanvas state={state} matrix={matrix}>
                {
                    state.toppedOut ? (
                        <div className={css.gameOver}>
                            <div className={css.gameOverText}>Game over</div>
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
