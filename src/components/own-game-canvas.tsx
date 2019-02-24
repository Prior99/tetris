import * as React from "react";
import { inject, external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { OwnGame } from "graphics";
import * as css from "./own-game-canvas.scss";
import { vec2 } from "utils";

@external
export class OwnGameCanvas extends React.Component {
    @inject private config: Config;
    @inject private ownGame: OwnGame;

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
        this.canvas = canvas;
        this.ownGame.updateCanvas(canvas);
        this.rescale();
    }

    public render() {
        return (
            <canvas ref={this.canvasRef} className={css.gameCanvas} />
        );
    }
}
