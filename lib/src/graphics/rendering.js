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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
const lodash_decorators_1 = require("lodash-decorators");
const utils_1 = require("utils");
const game_1 = require("game");
const sprites_1 = require("sprites");
const lighting_1 = require("./lighting");
const background_1 = require("./background");
const graphics_1 = require("./graphics");
function spriteForCellColor(cellColor) {
    switch (cellColor) {
        case game_1.CellColor.TETRIMINO_I: return sprites_1.SpriteTetriminoI;
        case game_1.CellColor.TETRIMINO_J: return sprites_1.SpriteTetriminoJ;
        case game_1.CellColor.TETRIMINO_L: return sprites_1.SpriteTetriminoL;
        case game_1.CellColor.TETRIMINO_O: return sprites_1.SpriteTetriminoO;
        case game_1.CellColor.TETRIMINO_S: return sprites_1.SpriteTetriminoS;
        case game_1.CellColor.TETRIMINO_T: return sprites_1.SpriteTetriminoT;
        case game_1.CellColor.TETRIMINO_Z: return sprites_1.SpriteTetriminoZ;
        case game_1.CellColor.GHOST: return sprites_1.SpriteTetriminoGhost;
    }
}
let Rendering = class Rendering extends graphics_1.Graphics {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.background.render();
            this.render();
        });
    }
    renderCell(pixelPosition, cellColor) {
        const { ctx } = this;
        if (!ctx) {
            return;
        }
        if (cellColor !== game_1.CellColor.EMPTY) {
            const position = pixelPosition.sub(utils_1.vec2(0, this.cellPixelSize.y));
            this.renderSprite(spriteForCellColor(cellColor), position, this.cellPixelSize);
        }
    }
    renderDebug() {
        if (!this.ctx) {
            return;
        }
        // Render grid.
        this.ctx.strokeStyle = "grey";
        this.ctx.fillStyle = "grey";
        this.ctx.font = "12px Arial";
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            const origin = this.translate(utils_1.vec2(0, y));
            const destination = this.translate(utils_1.vec2(this.config.visibleSize.x, y));
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(destination.x, destination.y);
            this.ctx.stroke();
            this.ctx.fillText(`${y}`, origin.x, origin.y);
        }
        for (let x = 0; x < this.config.visibleSize.x; ++x) {
            const origin = this.translate(utils_1.vec2(x, 0));
            const destination = this.translate(utils_1.vec2(x, this.config.visibleSize.y));
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(destination.x, destination.y);
            this.ctx.stroke();
            this.ctx.fillText(`${x}`, origin.x, origin.y);
        }
        // Render Tetrimino.
        const pos = this.translate(this.gameState.current.tetrimino.offset);
        const dimensions = this.gameState.current.tetrimino.matrix.dimensions.mult(this.cellPixelSize);
        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(pos.x, pos.y, dimensions.x, -dimensions.y);
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x - 10, pos.y - 10);
        this.ctx.lineTo(pos.x + 10, pos.y + 10);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x + 10, pos.y - 10);
        this.ctx.lineTo(pos.x - 10, pos.y + 10);
        this.ctx.stroke();
    }
    rescale(size) {
        super.rescale(size);
        this.lighting.rescale(size);
        this.background.rescale(size);
        this.background.render();
    }
    renderBackground() {
        this.background.render();
        this.ctx.globalCompositeOperation = "source-over";
        if (this.background.canvas) {
            this.ctx.drawImage(this.background.canvas, 0, 0, this.background.pixelSize.x, this.background.pixelSize.y, 0, 0, this.pixelSize.x, this.pixelSize.y);
        }
    }
    renderLighting() {
        this.lighting.render();
        this.ctx.globalCompositeOperation = "multiply";
        if (this.lighting.canvas) {
            this.ctx.drawImage(this.lighting.canvas, 0, 0, this.lighting.pixelSize.x, this.lighting.pixelSize.y, 0, 0, this.pixelSize.x, this.pixelSize.y);
        }
    }
    renderCells() {
        this.ctx.globalCompositeOperation = "source-over";
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = utils_1.vec2(x, y);
                this.renderCell(this.translate(pos), this.gameState.temporaryState.at(pos));
            }
        }
    }
    render() {
        if (!this.ctx) {
            return;
        }
        this.renderBackground();
        this.renderCells();
        this.renderLighting();
        if (this.gameState.debug) {
            this.renderDebug();
        }
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", lighting_1.Lighting)
], Rendering.prototype, "lighting", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", background_1.Background)
], Rendering.prototype, "background", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Rendering.prototype, "initialize", null);
__decorate([
    lodash_decorators_1.bind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Rendering.prototype, "render", null);
Rendering = __decorate([
    tsdi_1.component
], Rendering);
exports.Rendering = Rendering;
//# sourceMappingURL=rendering.js.map