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
const utils_1 = require("utils");
const image_manager_1 = require("./image-manager");
class Sprite {
    constructor(atlas) {
        this.atlas = atlas;
    }
    get image() {
        return this.images.image(this.atlas.meta.image);
    }
    get totalDuration() {
        return this.atlas.frames.map(frame => frame.duration).reduce((sum, duration) => sum + duration) / 1000;
    }
    offsetInAnimation(time) {
        return time % this.totalDuration;
    }
    frame(time) {
        let offset = this.offsetInAnimation(time);
        let index = 0;
        let frame = undefined;
        while (offset > 0) {
            frame = this.atlas.frames[index];
            offset -= frame.duration / 1000;
            index++;
        }
        return frame;
    }
    render(position, dimensions, ctx, time) {
        const frame = this.frame(time);
        if (!frame) {
            return;
        }
        ctx.drawImage(this.image, frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h, position.x, position.y, dimensions.x, dimensions.y);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.images.load(this.atlas.meta.image);
        });
    }
    get dimensions() {
        const { sourceSize } = this.atlas.frames[0];
        return utils_1.vec2(sourceSize.w, sourceSize.h);
    }
}
__decorate([
    tsdi_1.inject,
    __metadata("design:type", image_manager_1.ImageManager)
], Sprite.prototype, "images", void 0);
exports.Sprite = Sprite;
//# sourceMappingURL=sprite.js.map