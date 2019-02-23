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
const sprites_1 = require("sprites");
const graphics_1 = require("./graphics");
let Background = class Background extends graphics_1.Graphics {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateCanvas(document.createElement("canvas"));
        });
    }
    get spriteClass() {
        const { level } = this.gameState;
        if (level < 1) {
            return sprites_1.SpriteFloorWood;
        }
        return sprites_1.SpriteFloorWhiteTiles;
    }
    get sprite() {
        return this.sprites.sprite(this.spriteClass);
    }
    get shouldRender() {
        return this.lastLevelRendered !== this.gameState.level || (!this.lastResizeRendered || !this.lastResizeRendered.equals(this.pixelSize));
    }
    render() {
        if (!this.shouldRender) {
            return;
        }
        const { dimensions } = this.sprite;
        const renderSize = dimensions.mult(this.scaleFactor);
        for (let y = 0; y < this.pixelSize.y; y += renderSize.y) {
            for (let x = 0; x < this.pixelSize.x; x += renderSize.x) {
                this.renderSprite(this.spriteClass, utils_1.vec2(x, y), renderSize);
            }
        }
        this.lastLevelRendered = this.gameState.level;
        this.lastResizeRendered = this.pixelSize;
    }
};
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Background.prototype, "initialize", null);
__decorate([
    lodash_decorators_1.bind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Background.prototype, "render", null);
Background = __decorate([
    tsdi_1.component
], Background);
exports.Background = Background;
//# sourceMappingURL=background.js.map