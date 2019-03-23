import * as React from "react";
import { Networking } from "networking";
import { external, inject, initialize } from "tsdi";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";
import classNames from "classnames/bind";
import { bind } from "lodash-decorators";
import { ObservableGame } from "observable-game";
import { UI } from "ui";
import { Leaderboard } from "leaderboard";
import { TetriminoPreviews } from "../tetrimino-previews";
import { GameCanvas } from "../game-canvas";
import { Info } from "../info";
import { RemoteGame } from "../remote-game";
import { Scoreboard } from "../scoreboard";
import * as css from "./multi-player.scss";
import { GameOver } from "components/game-over";
import { Segment } from "semantic-ui-react";
import { MenuContainer } from "components/menu-container";

const cx = classNames.bind(css);

@external @observer
export class MultiPlayer extends React.Component {
    @inject private networking: Networking;
    @inject private observableGame: ObservableGame;
    @inject private ui: UI;
    @inject private leaderboard: Leaderboard;

    @observable private submitScoreVisible = false;
    @observable private leaderboardName = "";

    @initialize protected initialize() {
        this.leaderboardName = this.ui.name || "";
    }

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
        if (this.networking.gameOngoing) { this.networking.close(); }
    }

    @bind private handleLeaderboardNameChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.leaderboardName = evt.currentTarget.value;
    }

    @computed public get canRestart() {
        return this.networking.isHost && this.networking.allUsersGameOver;
    }

    public render() {
        const classes = cx({
            gameOver: true,
            winner: this.networking.isWinner,
        });
        return (
            <MenuContainer>
                <section className={css.multiPlayer}>
                    <div className={css.scoreboard}>
                        <Scoreboard />
                    </div>
                    <div className={css.wrapper}>
                        <Info />
                        <Segment style={{ margin: 0 }}>
                            <GameCanvas><GameOver multiPlayer /></GameCanvas>
                        </Segment>
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
            </MenuContainer>
        );
    }
}
