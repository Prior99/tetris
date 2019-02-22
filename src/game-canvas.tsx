import * as React from "react";
import { inject, external } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "./config";
import { GameState } from "./game-state";
import { Rendering } from "./rendering";
import * as css from "./game-canvas.scss";
import { Input } from "./input";
import { vec2, Vec2 } from "./vec2";

@external
export class GameCanvas extends React.Component {
    @inject private config: Config;
    @inject private gameState: GameState;
    @inject private rendering: Rendering;
    @inject private input: Input;

    private canvas?: HTMLCanvasElement;

    constructor(props: {}) {
        super(props);
        window.addEventListener("resize", this.rescale);
    }

    @bind private rescale() {
        const { canvas } = this;
        if (!canvas) { return; }
        const { pixelSize } =  this.rendering;
        canvas.style.width = `${pixelSize.x}px`;
        canvas.style.height = `${pixelSize.y}px`;
        canvas.width = pixelSize.x;
        canvas.height = pixelSize.y;
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.rescale();
        this.rendering.updateCanvas(canvas);
        this.gameState.start();
        this.input.enable();
    }

    public render() {
        return (
            <canvas ref={this.canvasRef} className={css.gameCanvas} />
        );
    }
}
