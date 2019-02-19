import * as React from "react";
import { inject, external } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "./config";
import { GameState } from "./game-state";
import { Rendering } from "./rendering";
import * as css from "./game-canvas.scss";

@external
export class GameCanvas extends React.Component {
    @inject private config: Config;
    @inject private gameState: GameState;
    @inject private rendering: Rendering;

    private canvas?: HTMLCanvasElement;

    constructor(props: {}) {
        super(props);
        window.addEventListener("resize", this.rescale);
    }

    @bind private rescale() {
        const { canvas } = this;
        if (!canvas) { return; }
        const rect = canvas.getBoundingClientRect();
        canvas.height = rect.height;
        const width = rect.height * this.config.ratio;
        canvas.width = width;
        canvas.style.width = `${width}px`;
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.rescale();
        this.rendering.updateCanvas(canvas);
        this.gameState.start();
    }

    public render() {
        return (
            <canvas ref={this.canvasRef} className={css.gameCanvas} />
        );
    }
}
