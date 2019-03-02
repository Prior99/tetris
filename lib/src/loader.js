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
bject.defineProperty(exports, "__esModule", { value: true });
onst tsdi_1 = require("tsdi");
onst mobx_1 = require("mobx");
onst sprites_1 = require("sprites");
onst audio_1 = require("audio");
onst sprites = require("./sprites");
onst audios = require("audio");
onst config_1 = require("./config");
onst allSprites = Object.keys(sprites).map(key => sprites[key]);
onst allAudios = Object.keys(audios).map(key => audios[key]);
ar LoadStatus;
function (LoadStatus) {
    LoadStatus["PENDING"] = "pending";
    LoadStatus["IN_PROGRESS"] = "in progress";
    LoadStatus["DONE"] = "done";
})(LoadStatus = exports.LoadStatus || (exports.LoadStatus = {}));
let Loader = class Loader {
    constructor() {
        this.resources = [];
    }
    queue(promise) {
        this.resources.push({
            status: LoadStatus.PENDING,
            promise,
        });
   }
   initialize() {
       return __awaiter(this, void 0, void 0, function* () {
           allSprites.forEach((sprite, index) => this.queue(this.sprites.load(sprite)));
           allAudios.forEach((audio, index) => this.queue(this.audios.load(audio)));
           for (let i = 0; i < this.resources.length; i += this.config.loadStride) {
               const slice = this.resources.slice(i, i + this.config.loadStride);
                slice.forEach(resource => resource.status = LoadStatus.IN_PROGRESS);
                yield Promise.all(slice.map(({ promise }) => promise));
                slice.forEach(resource => resource.status = LoadStatus.DONE);
            }
        });
    }
    get done() {
        return this.resources.length > 0 && this.resources.every(({ status }) => status === LoadStatus.DONE);
    }
;
_decorate([
   tsdi_1.inject,
   __metadata("design:type", sprites_1.SpriteManager)
, Loader.prototype, "sprites", void 0);
_decorate([
   tsdi_1.inject,
   __metadata("design:type", audio_1.AudioManager)
], Loader.prototype, "audios", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", config_1.Config)
], Loader.prototype, "config", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Array)
], Loader.prototype, "resources", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Loader.prototype, "initialize", null);
Loader = __decorate([
    tsdi_1.component
], Loader);
exports.Loader = Loader;
//# sourceMappingURL=loader.js.map
