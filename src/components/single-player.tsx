import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { ObservableGame } from "observable-game";
import { GameMode, Page } from "types";
import { randomSeed } from "utils";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { Leaderboard } from "leaderboard";
import { TetriminoPreviews } from "./tetrimino-previews";
import { GameCanvas } from "./game-canvas";
import { Info } from "./info";
import * as css from "./single-player.scss";

@external @observer
export class SinglePlayer extends React.Component {
    @inject private observableGame: ObservableGame;
    @inject private ui: UI;
    @inject private leaderboard: Leaderboard;

    @observable private submitScoreVisible = false;
    @observable private leaderboardName = "";

    @initialize protected initialize() {
        this.observableGame.start(GameMode.SINGLE_PLAYER);
        this.leaderboardName = this.ui.name || "";
    }

    @bind private handleReset() {
        this.ui.reset();
        this.observableGame.restart(randomSeed());
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
    }

    @bind private handleLeaderboardNameChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.leaderboardName = evt.currentTarget.value;
    }

    public render() {
        return (
            <section className={css.game}>
                <div className={css.wrapper}>
                    <Info />
                    <GameCanvas>
                        {
                            this.observableGame.gameOver ? (
                                <div className={css.gameOver}>
                                    <div className={css.gameOverText}>Game Over</div>
                                        <div className={css.restart}><a onClick={this.handleReset}>Restart</a></div>
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
            </section>
        );
    }
}
