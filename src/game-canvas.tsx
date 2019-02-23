import * as React from "react";
import { inject, external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "./config";
import { GameState } from "./game-state";
import { Rendering } from "./rendering";
import * as css from "./game-canvas.scss";
import { Input } from "./input";
import { vec2 } from "./vec2";

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

    @initialize protected initialize() {
        const renderLoop = () => {
            this.rendering.render();
            window.requestAnimationFrame(renderLoop);
        };
        renderLoop();
    }

    @bind private rescale() {
        const { canvas } = this;
        if (!canvas) { return; }
        const rect = document.body.getBoundingClientRect();
        const naturalSize = vec2(rect.height * this.config.visibleRatio, rect.height);
        const minimalSize = this.config.visibleSize.mult(this.config.tetriminoPixelSize);
        const adjustedSize = naturalSize.sub(naturalSize.mod(minimalSize));

        this.rendering.rescale(adjustedSize);

        canvas.style.width = `${adjustedSize.x}px`;
        canvas.style.height = `${adjustedSize.y}px`;
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.rendering.updateCanvas(canvas);
        this.rescale();
        this.gameState.start();
        this.input.enable();
    }

    public render() {
        return (
            <canvas ref={this.canvasRef} className={css.gameCanvas} />
        );
    }
}
