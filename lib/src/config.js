"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
const utils_1 = require("utils");
let Config = class Config {
    constructor() {
        this.logicalSize = utils_1.vec2(10, 24);
        this.visibleSize = utils_1.vec2(10, 20);
        this.tickSpeed = 1 / 60;
        this.initialInputTimeout = 10 / 60;
        this.inputRepeatTimeout = 1.5 / 60;
        this.inputRotateRepeatTimeout = 10 / 60;
        this.tetriminoPixelSize = 32;
        this.loadStride = 2;
    }
    get visibleRatio() {
        return this.visibleSize.x / this.visibleSize.y;
    }
};
Config = __decorate([
    tsdi_1.component
], Config);
exports.Config = Config;
//# sourceMappingURL=config.js.map