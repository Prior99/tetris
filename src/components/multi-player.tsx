import * as React from "react";
import { Networking } from "networking";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";
import { bind } from "lodash-decorators";
import { ObservableGame } from "observable-game";
import { UI } from "ui";
import { Page } from "types";
import { randomSeed } from "utils";
import { Leaderboard } from "leaderboard";
import { TetriminoPreviews } from "./tetrimino-previews";
import { GameCanvas } from "./game-canvas";
import { Info } from "./info";
import * as css from "./multi-player.scss";
import { RemoteGame } from "./remote-game";

@external @observer
export class MultiPlayer extends React.Component {
    @inject private networking: Networking;
    @inject private observableGame: ObservableGame;
    @inject private ui: UI;
    @inject private leaderboard: Leaderboard;

    @observable private submitScoreVisible = false;
    @observable private leaderboardName = "";

    @bind private handleReset() {
        this.networking.sendRestartGame();
    }

    @bind private handleSubmitScore() {
        this.submitScoreVisible = true;
    }

    @bind private handleLeaderboardSubmit() {
        this.submitScoreVisible = false;
        this.leaderboard.submitScore(this.leaderboardName, this.observableGame.score);
        this.ui.leaderboardSubmitted = true;
    }

    @bind private handleBack() {
        this.observableGame.stop();
        this.ui.page = Page.MENU;
        if (this.networking.gameOngoing) { this.networking.close(); }
    }

    @bind private handleLeaderboardNameChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.leaderboardName = evt.currentTarget.value;
    }

    @computed public get canRestart() {
        return this.networking.isHost && this.networking.allUsersGameOver;
    }

    public render() {
        return (
            <section className={css.multiPlayer}>
                <div className={css.wrapper}>
                    <Info />
                    <GameCanvas>
                        {
                            this.observableGame.gameOver ? (
                                <div className={css.gameOver}>
                                    <div className={css.gameOverText}>Game Over</div>
                                    {
                                        this.canRestart ? (
                                            <div className={css.restart}><a onClick={this.handleReset}>Restart</a></div>
                                        ) : <></>
                                    }
                                    {
                                        this.ui.leaderboardSubmitted ? (
                                            <></>
                                        ) : (
                                            <div className={css.submitScore}>
                                                {
                                                    !this.submitScoreVisible ? (
                                                        <a onClick={this.handleSubmitScore}>Submit score</a>
                                                    ) : (
                                                        <div className={css.submitScoreForm}>
                                                            <input
                                                                value={this.leaderboardName}
                                                                onChange={this.handleLeaderboardNameChange}
                                                            />
                                                            <button onClick={this.handleLeaderboardSubmit}>
                                                                Submit
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                    <div className={css.back}><a onClick={this.handleBack}>Back</a></div>
                                </div>
                            ) : <></>
                        }
                    </GameCanvas>
                    <TetriminoPreviews />
                </div>
                <div className={css.others}>
                    {
                        this.networking.allUsers
                            .filter(user => user.id !== this.networking.ownId)
                            .map(user => <RemoteGame key={user.id} userId={user.id} />)
                    }
                </div>
            </section>
        );
    }
}
