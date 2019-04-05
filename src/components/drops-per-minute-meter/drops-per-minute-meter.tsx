import * as React from "react";
import { observer } from "mobx-react";
import { inject, external } from "tsdi";
import { vec2 } from "utils";
import { bind } from "lodash-decorators";
import * as css from "./drops-per-minute-meter.scss";
import { Game } from "game";
import { Config } from "config";

@external @observer
export class DropsPerMinuteMeter extends React.Component {
    @inject private game: Game;
    @inject private config: Config;

    private canvas?: HTMLCanvasElement;
    private ctx?: CanvasRenderingContext2D;
    private running = true;

    constructor(props: {}) {
        super(props);
        window.addEventListener("resize", this.rescale);
    }

    public componentWillUnmount() {
        window.removeEventListener("rescale", this.rescale);
        this.running = false;
    }

    @bind private rescale() {
        if (!this.canvas) { return; }
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    private get dropsPerMinute() {
        return this.game.statistics ? this.game.statistics.currentLocksPerMinute : 0;
    }

    private get targetXY() {
        if (!this.canvas) { return vec2(0, 0); }
        const relative = this.dropsPerMinute / this.config.maxLocksPerMinute;
        const x = this.canvas.width / 2 - Math.cos(relative * Math.PI) * this.canvas.width / 2;
        const y = this.canvas.height - Math.sin(relative * Math.PI) * this.canvas.height;
        return vec2(x, y);
    }

    @bind private renderCanvas() {
        if (!this.running) { return; }
        const { canvas, ctx } = this;
        if (!canvas || !ctx) {
            window.requestAnimationFrame(this.renderCanvas);
            return;
        }
        const { targetXY } = this;
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgb(50, 32, 213)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height);
        ctx.lineTo(targetXY.x, targetXY.y);
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.font = `${canvas.height - 20}px Lato`;
        ctx.textAlign = "center";
        ctx.fillText(`${Math.floor(this.dropsPerMinute)}`, canvas.width / 2, canvas.height - 10);
        window.requestAnimationFrame(this.renderCanvas);
    }

    @bind private canvasRef(canvas: HTMLCanvasElement) {
        if (!canvas) { return; }
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.running = true;
        this.rescale();
        this.renderCanvas();
    }

    public render() {
        this.renderCanvas();
        return (
            <canvas ref={this.canvasRef} className={css.dropsPerMinuteMeter} />
        );
    }
}
