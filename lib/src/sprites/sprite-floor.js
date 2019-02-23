"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
const sprite_1 = require("./sprite");
const RandomSeed = require("random-seed");
let SpriteFloor = class SpriteFloor extends sprite_1.Sprite {
    render(position, dimensions, ctx) {
        const rand = RandomSeed.create();
        rand.seed(`${position.x + position.y * dimensions.y}`);
        const frame = this.atlas.frames[rand.range(this.atlas.frames.length)];
        ctx.drawImage(this.image, frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h, position.x, position.y, dimensions.x, dimensions.y);
    }
};
SpriteFloor = __decorate([
    tsdi_1.external
], SpriteFloor);
exports.SpriteFloor = SpriteFloor;
//# sourceMappingURL=sprite-floor.js.map