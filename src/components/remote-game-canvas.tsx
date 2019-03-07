import * as React from "react";
import { inject, external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { GraphicsRemoteGame } from "graphics";
import { vec2, Matrix  } from "utils";
import { RemoteGameState } from "types";
import * as css from "./remote-game-canvas.scss";

@external
export class RemoteGameCanvas extends React.Component<{ matrix: Matrix, state: RemoteGameState }> {
    @inject private config: Config;

    private canvas?: HTMLCanvasElement;
    private running = false;
    private graphics: GraphicsRemoteGame;

    constructor(props: { matrix: Matrix, state: RemoteGameState }) {
        super(props);
        window.addEventListener("resize", this.rescale);
        this.graphics = new GraphicsRemoteGame(props.matrix);
    }

    @initialize protected initialize() {
        const renderLoop = () => {
            if (!this.running) { return; }
            this.graphics.render();
            window.requestAnimationFrame(renderLoop);
        };
        this.running = true;
        renderLoop();
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.rescale);
        this.running = false;
    }

    @bind private rescale() {
        const { canvas } = this;
        if (!canvas) { return; }
        const rect = document.body.getBoundingClientRect();
        const naturalSize = vec2(rect.height * this.config.visibleRatio, rect.height);
        const minimalSize = this.config.visibleSize.mult(this.config.tetriminoPixelSize);
        const adjustedSize = naturalSize.sub(naturalSize.mod(minimalSize));

        this.graphics.rescale(adjustedSize);

        canvas.style.width = `${adjustedSize.x / 2}px`;
        canvas.style.height = `${adjustedSize.y / 2}px`;
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
                <canvas ref={this.canvasRef} className={css.gameCanvas} />
            </div>
        );
    }
}
