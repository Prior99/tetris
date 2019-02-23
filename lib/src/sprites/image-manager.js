"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
let ImageManager = class ImageManager {
    constructor() {
        this.images = new Map();
        this.handlers = new Map();
        this.failed = new Set();
    }
    load(url) {
        return new Promise((resolve, reject) => {
            if (this.failed.has(url)) {
                reject(new Error("Image failed to load earlier."));
            }
            if (this.handlers.has(url)) {
                this.handlers.get(url).push({ resolve, reject });
                return;
            }
            this.handlers.set(url, [{ resolve, reject }]);
            const image = new Image();
            image.addEventListener("load", () => {
                this.handlers.get(url).forEach(({ resolve: resolveHandler }) => resolveHandler(image));
                this.images.set(url, image);
                this.handlers.delete(url);
            });
            image.addEventListener("error", err => {
                this.handlers.get(url).forEach(({ reject: rejectHandler }) => rejectHandler(err));
                this.failed.add(url);
                this.handlers.delete(url);
            });
            image.src = url;
        });
    }
    image(url) {
        if (!this.images.has(url)) {
            throw new Error(`Attempted to get image which was not loaded: ${url}`);
        }
        return this.images.get(url);
    }
};
ImageManager = __decorate([
    tsdi_1.component
], ImageManager);
exports.ImageManager = ImageManager;
//# sourceMappingURL=image-manager.js.map