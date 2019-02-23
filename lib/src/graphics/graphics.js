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
const tsdi_1 = require("tsdi");
const game_1 = require("game");
const config_1 = require("config");
const utils_1 = require("utils");
const sprites_1 = require("sprites");
let Graphics = class Graphics {
    constructor() {
        this.pixelSize = utils_1.vec2(0, 0);
    }
    updateCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.ctx.imageSmoothingEnabled = false;
    }
    get cellPixelSize() {
        const size = this.pixelSize.x / this.config.visibleSize.x;
        return utils_1.vec2(size, size);
    }
    renderClear() {
        if (!this.ctx) {
            return;
        }
        this.ctx.clearRect(0, 0, this.pixelSize.x, this.pixelSize.y);
    }
    translate(pos) {
        return utils_1.vec2(pos.x, this.config.visibleSize.y - pos.y).mult(this.cellPixelSize);
    }
    rescale(size) {
        if (!this.canvas) {
            return;
        }
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.pixelSize = size;
    }
    get scaleFactor() {
        return this.cellPixelSize.div(this.config.tetriminoPixelSize);
    }
    renderSprite(sprite, position, dimensions, time) {
        this.sprites.sprite(sprite).render(position, dimensions, this.ctx, typeof time === "number" ? time : this.gameState.seconds);
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", game_1.GameState)
], Graphics.prototype, "gameState", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", config_1.Config)
], Graphics.prototype, "config", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", sprites_1.SpriteManager)
], Graphics.prototype, "sprites", void 0);
Graphics = __decorate([
    tsdi_1.component
], Graphics);
exports.Graphics = Graphics;
//# sourceMappingURL=graphics.js.map