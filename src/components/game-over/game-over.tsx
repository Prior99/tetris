import * as React from "react";
import { observer } from "mobx-react";
import { Networking } from "networking";
import { external, inject, initialize } from "tsdi";
import { History } from "history";
import { observable, computed } from "mobx";
import classNames from "classnames/bind";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { Leaderboard } from "leaderboard";
import { ObservableGame } from "observable-game";
import { leaderboardEnabled } from "utils";
import * as css from "./game-over.scss";
import { Button, Input } from "semantic-ui-react";

const cx = classNames.bind(css);

@external @observer
export class GameOver extends React.Component<{ multiPlayer?: boolean }> {
    @inject private observableGame: ObservableGame;
    @inject private ui: UI;
    @inject private leaderboard: Leaderboard;
    @inject private networking: Networking;
    @inject("History") private history: History;

    @observable private leaderboardName = "";

    @initialize protected initialize() {
        this.leaderboardName = this.ui.name || "";
    }

    @bind private handleRestart() {
        if (this.props.multiPlayer) {
            this.networking.restartGame();
            return;
        }
        this.ui.reset();
        this.observableGame.restart(this.ui.parameters);
    }

    @bind private handleLeaderboardSubmit() {
        this.leaderboard.submitScore(this.leaderboardName, this.observableGame.score);
        this.ui.leaderboardSubmitted = true;
    }

    @bind private handleLeaderboardNameChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.leaderboardName = evt.currentTarget.value;
    }

    @bind private handleBack() {
        this.observableGame.stop();
        this.history.push("/main-menu");
    }

    @computed private get leaderboardFormVisible() {
        return !this.ui.leaderboardSubmitted && leaderboardEnabled(this.ui.parameters);
    }

    @computed private get isWinner() {
        return this.props.multiPlayer && this.networking.isWinner;
    }

    @computed private get canRestart() {
        return !this.props.multiPlayer || (this.networking.isHost && this.networking.allUsersGameOver);
    }

    @computed private get classes() {
        return cx({
            gameOver: true,
            winner: this.isWinner,
        });
    }

    public render() {
        if (!this.observableGame.gameOver) {
            return <></>;
        }
        return (
            <div className={this.classes}>
                <div className={css.inner}>
                    <div className={css.gameOverText}>
                        {this.isWinner ? "Winner" : "Game Over"}
                    </div>
                    {
                        this.leaderboardFormVisible && (
                            <Input
                                value={this.leaderboardName}
                                onChange={this.handleLeaderboardNameChange}
                                action={
                                    <Button onClick={this.handleLeaderboardSubmit}>Submit</Button>
                                }
                            />
                        )
                    }
                    <Button fluid onClick={this.handleBack}>Back</Button>
                    { this.canRestart && <Button fluid primary onClick={this.handleRestart}>Restart</Button> }
                </div>
            </div>
        );
    }
}
