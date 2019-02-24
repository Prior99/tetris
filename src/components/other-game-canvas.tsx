import * as React from "react";
import { inject, external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { OtherGame } from "graphics";
import * as css from "./own-game-canvas.scss";
import { vec2 } from "utils";
import { Matrix } from "game";

@external
export class OtherGameCanvas extends React.Component<{ matrix: Matrix }> {
    @inject private config: Config;

    private canvas?: HTMLCanvasElement;
    private renderer: OtherGame;

    constructor(props: { matrix: Matrix }) {
        super(props);
        window.addEventListener("resize", this.rescale);
        this.renderer = new OtherGame(props.matrix);
    }

    @initialize protected initialize() {
        const renderLoop = () => {
            this.renderer.render();
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

        this.renderer.rescale(adjustedSize);

        canvas.style.width = `${adjustedSize.x / 2}px`;
        canvas.style.height = `${adjustedSize.y / 2}px`;
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.renderer.updateCanvas(canvas);
        this.rescale();
    }

    public render() {
        return (
            <canvas ref={this.canvasRef} className={css.gameCanvas} />
        );
    }
}
