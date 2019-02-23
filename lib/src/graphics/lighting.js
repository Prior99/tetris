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
const graphics_1 = require("./graphics");
const sprites_1 = require("sprites");
let Lighting = class Lighting extends graphics_1.Graphics {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateCanvas(document.createElement("canvas"));
        });
    }
    get lightSprite() {
        return this.sprites.sprite(sprites_1.SpriteTetriminoLight);
    }
    renderCell(pixelPosition, cellColor) {
        this.ctx.fillStyle = "white";
        const margin = utils_1.vec2((this.lightSprite.dimensions.x - this.config.tetriminoPixelSize) / 2, (this.lightSprite.dimensions.y - this.config.tetriminoPixelSize) / 2).mult(this.scaleFactor);
        if (cellColor !== game_1.CellColor.EMPTY) {
            const position = pixelPosition.sub(utils_1.vec2(0, this.cellPixelSize.y));
            const { totalDuration } = this.sprites.sprite(sprites_1.SpriteTetriminoLight);
            const time = this.gameState.timeSinceLastHit < totalDuration
                ? this.gameState.timeSinceLastHit
                : totalDuration - 0.001;
            this.renderSprite(sprites_1.SpriteTetriminoLight, position.sub(margin), this.lightSprite.dimensions.mult(this.scaleFactor), time);
        }
    }
    render() {
        this.renderClear();
        this.ctx.globalCompositeOperation = "lighten";
        this.ctx.fillStyle = "rgb(60, 60, 60)";
        this.ctx.fillRect(0, 0, this.pixelSize.x, this.pixelSize.y);
        for (let y = 0; y < this.config.visibleSize.y; ++y) {
            for (let x = 0; x < this.config.visibleSize.x; ++x) {
                const pos = utils_1.vec2(x, y);
                this.renderCell(this.translate(pos), this.gameState.temporaryState.at(pos));
            }
        }
    }
};
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Lighting.prototype, "initialize", null);
__decorate([
    lodash_decorators_1.bind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Lighting.prototype, "render", null);
Lighting = __decorate([
    tsdi_1.component
], Lighting);
exports.Lighting = Lighting;
//# sourceMappingURL=lighting.js.map