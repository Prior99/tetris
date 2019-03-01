import * as React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { inject, external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { OwnGame } from "graphics";
import { GameState, ShuffleBag } from "game";
import { UI, GameMode, Page } from "ui";
import { Networking, NetworkingMode, NetworkGame } from "networking";
import * as css from "./own-game-canvas.scss";
import { vec2 } from "utils";
import { Leaderboard } from "leaderboard";

@external @observer
export class OwnGameCanvas extends React.Component {
    @inject private config: Config;
    @inject private ownGame: OwnGame;
    @inject private gameState: GameState;
    @inject private ui: UI;
    @inject private networking: Networking;
    @inject private networkGame: NetworkGame;
    @inject private shuffleBag: ShuffleBag;
    @inject private leaderboard: Leaderboard;

    @observable private submitScoreVisible = false;
    @observable private leaderboardName = "";
    @observable private submitted = false;

    private canvas?: HTMLCanvasElement;

    constructor(props: {}) {
        super(props);
        window.addEventListener("resize", this.rescale);
    }

    @initialize protected initialize() {
        const renderLoop = () => {
            this.ownGame.render();
            window.requestAnimationFrame(renderLoop);
        };
        this.leaderboardName = this.ui.name || "";
        renderLoop();
    }

    @bind private rescale() {
        const { canvas } = this;
        if (!canvas) { return; }
        const rect = document.body.getBoundingClientRect();
        const naturalSize = vec2(rect.height * this.config.visibleRatio, rect.height);
        const minimalSize = this.config.visibleSize.mult(this.config.tetriminoPixelSize);
        const adjustedSize = naturalSize.sub(naturalSize.mod(minimalSize));

        this.ownGame.rescale(adjustedSize);

        canvas.style.width = `${adjustedSize.x}px`;
        canvas.style.height = `${adjustedSize.y}px`;
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        if (!canvas) { return; }
        this.canvas = canvas;
        this.ownGame.updateCanvas(canvas);
        this.rescale();
    }

    @bind private handleReset() {
        const seed = `${Math.random}`.replace(/\./, "");
        if (this.ui.gameMode === GameMode.SINGLE_PLAYER || this.networking.mode === NetworkingMode.HOST) {
            this.gameState.reset();
            this.gameState.start();
            this.shuffleBag.reset(seed);
        }
        this.networking.restart(seed);
        this.submitted = false;
    }

    @bind private handleSubmitScore() {
        this.submitScoreVisible = true;
    }

    @bind private handleLeaderboardSubmit() {
        this.submitScoreVisible = false;
        this.leaderboard.submitScore(this.leaderboardName, this.gameState.score);
        this.submitted = true;
    }

    @bind private handleBack() {
        this.ui.page = Page.MENU;
    }

    @bind private handleLeaderboardNameChange(evt: React.SyntheticEvent<HTMLInputElement>) {
        this.leaderboardName = evt.currentTarget.value;
    }

    public get canRestart() {
        return this.ui.gameMode === GameMode.SINGLE_PLAYER || (
            this.networking.mode === NetworkingMode.HOST &&
            this.networkGame.allStates.every(({ toppedOut }) => toppedOut)
        );
    }

    public render() {
        return (
            <div className={css.canvasWrapper}>
                {
                    this.gameState.toppedOut ? (
                        <div className={css.gameOver}>
                            <div className={css.gameOverText}>Game over</div>
                            {
                                this.canRestart ? (
                                    <div className={css.restart}><a onClick={this.handleReset}>Restart</a></div>
                                    ) : <></>
                            }
                            {
                                this.submitted ? (
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
                                                    <button onClick={this.handleLeaderboardSubmit}>Submit</button>
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
                <canvas ref={this.canvasRef} className={css.gameCanvas} />
            </div>
        );
    }
}
