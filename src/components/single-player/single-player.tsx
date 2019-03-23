import * as React from "react";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { ObservableGame } from "observable-game";
import { Page, WinningCondition, WinningConditionType, GarbageMode, GameMode, GameParameters } from "types";
import { leaderboardEnabled } from "utils";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { Leaderboard } from "leaderboard";
import { TetriminoPreviews } from "../tetrimino-previews";
import { GameCanvas } from "../game-canvas";
import { Info } from "../info";
import * as css from "./single-player.scss";
import { Dimmer, Loader } from "semantic-ui-react";
import { SinglePlayerSetup } from "components/single-player-setup";
import cond from "ramda/es/cond";

function winningConditionFromString(condition: WinningConditionType, secondsOrLives: string): WinningCondition {
    switch (condition) {
        case WinningConditionType.BATTLE_ROYALE:
            return { condition, lives: Number(secondsOrLives) };
        case WinningConditionType.CLEAR_GARBAGE:
            return { condition };
        case WinningConditionType.HIGHEST_SCORE_ONE_GAME:
            return { condition };
        case WinningConditionType.SUM_IN_TIME:
            return { condition, seconds: Number(secondsOrLives) };
    }
}

function levelUpFromString(levelUpDisabled: string) {
    switch (levelUpDisabled) {
        case "no-levelup": return true;
        case "levelup": return false;
    }
}

interface SinglePlayerProps {
    readonly match: {
        readonly params: {
            readonly initialLevel: string;
            readonly initialGarbageLines: string;
            readonly garbageMode: GarbageMode;
            readonly levelUpDisabled: string;
            readonly condition: WinningConditionType;
            readonly secondsOrLives: string;
        };
    };
}

@external @observer
export class SinglePlayer extends React.Component<SinglePlayerProps> {
    @inject private observableGame: ObservableGame;
    @inject private ui: UI;
    @inject private leaderboard: Leaderboard;

    @observable private submitScoreVisible = false;
    @observable private leaderboardName = "";
    @observable private loading = true;

    @initialize protected initialize() {
        this.observableGame.start({ ...this.ui.parameters, ...this.parameters });
        this.leaderboardName = this.ui.name || "";
        this.loading = false;
    }

    private get parameters(): Partial<GameParameters> {
        const {
            initialGarbageLines,
            garbageMode,
            initialLevel,
            levelUpDisabled,
            condition,
            secondsOrLives,
        } = this.props.match.params;
        return {
            initialGarbageLines: Number(initialGarbageLines),
            garbageMode,
            initialLevel: Number(initialLevel),
            levelUpDisabled: levelUpFromString(levelUpDisabled),
            winningCondition: winningConditionFromString(condition, secondsOrLives),
        };
    }

    @bind private handleReset() {
        this.ui.reset();
        this.observableGame.restart(this.ui.parameters);
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
        if (this.loading) {
            return (
                <Dimmer active>
                    <Loader />
                </Dimmer>
            );
        }
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
                                        this.ui.leaderboardSubmitted || !leaderboardEnabled(this.ui.parameters) ? (
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
