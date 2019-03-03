import * as React from "react";
import { inject, external, initialize } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { OtherGame } from "graphics";
import { vec2, Matrix  } from "utils";
import { RemoteGameState } from "types";
import * as css from "./other-game-canvas.scss";

@external
export class OtherGameCanvas extends React.Component<{ matrix: Matrix, state: RemoteGameState }> {
    @inject private config: Config;

    private canvas?: HTMLCanvasElement;
    private renderer: OtherGame;
    private running = false;

    constructor(props: { matrix: Matrix, state: RemoteGameState }) {
        super(props);
        window.addEventListener("resize", this.rescale);
        this.renderer = new OtherGame(props.matrix);
    }

    @initialize protected initialize() {
        const renderLoop = () => {
            if (!this.running) { return; }
            this.renderer.render();
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

        this.renderer.rescale(adjustedSize);

        canvas.style.width = `${adjustedSize.x / 2}px`;
        canvas.style.height = `${adjustedSize.y / 2}px`;
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        if (!canvas) { return; }
        this.canvas = canvas;
        this.renderer.updateCanvas(canvas);
        this.rescale();
    }

    public render() {
        return (
            <div className={css.canvasWrapper}>
                {
                    this.props.state.toppedOut ? (
                        <div className={css.gameOver}>
                            <div className={css.gameOverText}>Game over</div>
                            <div className={css.gameOverStats}>
                                <div className={css.info}>
                                    <div className={css.label}>Score</div>
                                    <div className={css.value}>{this.props.state.score}</div>
                                </div>
                                <div className={css.info}>
                                    <div className={css.label}>Lines</div>
                                    <div className={css.value}>{this.props.state.lines}</div>
                                </div>
                                <div className={css.info}>
                                    <div className={css.label}>Level</div>
                                    <div className={css.value}>{this.props.state.level}</div>
                                </div>
                            </div>
                        </div>
                    ) : <></>
                }
                <canvas ref={this.canvasRef} className={css.gameCanvas} />
            </div>
        );
    }
}
