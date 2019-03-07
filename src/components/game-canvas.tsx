import * as React from "react";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";
import { inject, external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { GraphicsGame } from "graphics";
import { Game } from "game";
import { UI } from "ui";
import { Networking } from "networking";
import { vec2, randomSeed } from "utils";
import { ObservableGame } from "observable-game";
import { Leaderboard } from "leaderboard";
import { Page } from "types";
import * as css from "./game-canvas.scss";

@external @observer
export class GameCanvas extends React.Component {
    @inject private config: Config;
    @inject private observableGame: ObservableGame;
    @inject private game: Game;
    @inject private ui: UI;
    @inject private networking: Networking;
    @inject private leaderboard: Leaderboard;

    @observable private submitScoreVisible = false;
    @observable private leaderboardName = "";

    private graphics: GraphicsGame;
    private canvas?: HTMLCanvasElement;
    private running = false;

    constructor(props: {}) {
        super(props);
        window.addEventListener("resize", this.rescale);
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.rescale);
        this.running = false;
    }

    @initialize protected initialize() {
        this.graphics = new GraphicsGame(this.game);
        const renderLoop = () => {
            if (!this.running) { return; }
            if (this.observableGame.running) {
                this.graphics.render();
            }
            window.requestAnimationFrame(renderLoop);
        };
        this.leaderboardName = this.ui.name || "";
        this.running = true;
        renderLoop();
    }

    @bind private rescale() {
        const { canvas } = this;
        if (!canvas) { return; }
        const rect = document.body.getBoundingClientRect();
        const naturalSize = vec2(rect.height * this.config.visibleRatio, rect.height);
        const minimalSize = this.config.visibleSize.mult(this.config.tetriminoPixelSize);
        const adjustedSize = naturalSize.sub(naturalSize.mod(minimalSize));

        this.graphics.rescale(adjustedSize);

        canvas.style.width = `${adjustedSize.x}px`;
        canvas.style.height = `${adjustedSize.y}px`;
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        if (!canvas) { return; }
        this.canvas = canvas;
        this.graphics.updateCanvas(canvas);
        this.rescale();
    }

    public render() {
        return (
            <div className={css.canvasWrapper}>
                {this.props.children}
                <canvas ref={this.canvasRef} className={css.observableGameCanvas} />
            </div>
        );
    }
}
