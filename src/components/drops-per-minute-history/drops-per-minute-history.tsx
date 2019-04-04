import * as React from "react";
import { observer } from "mobx-react";
import { inject, external } from "tsdi";
import { bind } from "lodash-decorators";
import * as css from "./drops-per-minute-history.scss";
import { Game } from "game";
import { Config } from "config";

const resolution = 2;

@external @observer
export class DropsPerMinuteHistory extends React.Component {
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

    private renderGrid() {
        const { canvas, ctx } = this;
        if (!canvas || !ctx) { return; }
        ctx.strokeStyle = "rgba(34, 36, 38, .15)";
        for (let x = 0; x < canvas.width; x += canvas.width / 10) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = canvas.height; y > 0; y -= canvas.height / 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    private get maxDataAmount() {
        return this.canvas ? this.canvas.width / resolution : 0;
    }

    private get dataAmount() {
        return this.game.statistics ? Math.min(this.maxDataAmount, this.game.statistics.pastIntervals.length) : 0;
    }

    private get stats() {
        const { statistics } = this.game;
        if (!statistics) { return []; }
        const { pastIntervals } = statistics;
        return pastIntervals.slice(pastIntervals.length - this.dataAmount, pastIntervals.length);
    }

    private get yScaleFactor() {
        return this.canvas ? this.canvas.height / this.config.maxLocksPerMinute : 0;
    }

    private renderDropsPerMinute() {
        const { canvas, ctx } = this;
        if (!canvas || !ctx) { return; }
        const { stats } = this;
        ctx.beginPath();
        ctx.strokeStyle = "rgba(50, 32, 213)";
        for (let index = 0; index < stats.length; ++index) {
            const x = index * resolution + (this.maxDataAmount - this.dataAmount) * resolution;
            const y = Math.max(1, canvas.height - Math.ceil(this.yScaleFactor * stats[index].locksPerMinute));
            if (index === 0) { ctx.moveTo(x, y); }
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    private renderLinesPerMinute() {
        const { canvas, ctx } = this;
        if (!canvas || !ctx) { return; }
        const { stats } = this;
        ctx.beginPath();
        ctx.strokeStyle = "rgb(221, 32, 52)";
        for (let index = 0; index < stats.length; ++index) {
            const x = index * resolution + (this.maxDataAmount - this.dataAmount) * resolution;
            const y = canvas.height - Math.ceil(this.yScaleFactor * stats[index].linesPerMinute);
            if (index === 0) { ctx.moveTo(x, y); }
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }

    @bind private renderCanvas() {
        if (!this.running) { return; }
        const { canvas, ctx, game } = this;
        if (!canvas || !ctx || !game.statistics) {
            window.requestAnimationFrame(this.renderCanvas);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.renderGrid();
        this.renderDropsPerMinute();
        this.renderLinesPerMinute();
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
            <canvas ref={this.canvasRef} className={css.dropsPerMinuteHistory} />
        );
    }
}
