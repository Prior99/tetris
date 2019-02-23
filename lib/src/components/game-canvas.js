"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const tsdi_1 = require("tsdi");
const lodash_decorators_1 = require("lodash-decorators");
const config_1 = require("config");
const game_1 = require("game");
const graphics_1 = require("graphics");
const css = require("./game-canvas.scss");
const input_1 = require("input");
const utils_1 = require("utils");
let GameCanvas = class GameCanvas extends React.Component {
    constructor(props) {
        super(props);
        window.addEventListener("resize", this.rescale);
    }
    initialize() {
        const renderLoop = () => {
            this.rendering.render();
            window.requestAnimationFrame(renderLoop);
        };
        renderLoop();
    }
    rescale() {
        const { canvas } = this;
        if (!canvas) {
            return;
        }
        const rect = document.body.getBoundingClientRect();
        const naturalSize = utils_1.vec2(rect.height * this.config.visibleRatio, rect.height);
        const minimalSize = this.config.visibleSize.mult(this.config.tetriminoPixelSize);
        const adjustedSize = naturalSize.sub(naturalSize.mod(minimalSize));
        this.rendering.rescale(adjustedSize);
        canvas.style.width = `${adjustedSize.x}px`;
        canvas.style.height = `${adjustedSize.y}px`;
    }
    canvasRef(canvas) {
        this.canvas = canvas;
        this.rendering.updateCanvas(canvas);
        this.rescale();
        this.gameState.start();
        this.input.enable();
    }
    render() {
        return (React.createElement("canvas", { ref: this.canvasRef, className: css.gameCanvas }));
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", config_1.Config)
], GameCanvas.prototype, "config", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", game_1.GameState)
], GameCanvas.prototype, "gameState", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", graphics_1.Rendering)
], GameCanvas.prototype, "rendering", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", input_1.Input)
], GameCanvas.prototype, "input", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameCanvas.prototype, "initialize", null);
__decorate([
    lodash_decorators_1.bind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameCanvas.prototype, "rescale", null);
__decorate([
    lodash_decorators_1.bind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HTMLCanvasElement]),
    __metadata("design:returntype", void 0)
], GameCanvas.prototype, "canvasRef", null);
GameCanvas = __decorate([
    tsdi_1.external,
    __metadata("design:paramtypes", [Object])
], GameCanvas);
exports.GameCanvas = GameCanvas;
//# sourceMappingURL=game-canvas.js.map