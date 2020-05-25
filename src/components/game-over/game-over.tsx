import * as React from "react";
import { observer } from "mobx-react";
import { Networking } from "networking";
import { external, inject } from "tsdi";
import { History } from "history";
import { computed } from "mobx";
import classNames from "classnames/bind";
import { bind } from "lodash-decorators";
import { UI } from "ui";
import { ObservableGame } from "observable-game";
import * as css from "./game-over.scss";
import { Button } from "semantic-ui-react";

const cx = classNames.bind(css);

@external @observer
export class GameOver extends React.Component<{ multiPlayer?: boolean }> {
    @inject private observableGame: ObservableGame;
    @inject private ui: UI;
    @inject private networking: Networking;
    @inject("History") private history: History;

    @bind private handleRestart() {
        if (this.props.multiPlayer) {
            this.networking.restartGame();
            return;
        }
        this.ui.reset();
        this.observableGame.restart(this.ui.parameters);
    }

    @bind private handleStats() {
        this.ui.showStats = true;
    }

    @bind private handleBack() {
        this.observableGame.stop();
        this.history.push("/main-menu");
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
                    <Button color="yellow" onClick={this.handleStats}>Show Stats</Button>
                    { this.canRestart && <Button fluid primary onClick={this.handleRestart}>Restart</Button> }
                    <Button fluid onClick={this.handleBack}>Back</Button>
                </div>
            </div>
        );
    }
}
