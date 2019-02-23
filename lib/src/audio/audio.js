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
let Audio = class Audio {
    constructor(url, gain) {
        this.url = url;
        this.gain = gain;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url);
            const data = yield response.arrayBuffer();
            this.audioBuffer = yield this.audioContext.decodeAudioData(data);
        });
    }
    get duration() {
        if (!this.audioBuffer) {
            throw new Error(`Attempted to get duration of audio which was not loaded:${this.url}`);
        }
        return this.audioBuffer.duration;
    }
    createSource() {
        if (!this.audioBuffer) {
            throw new Error(`Attempted to play audio which was not loaded: ${this.url}`);
        }
        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;
        const gain = this.audioContext.createGain();
        source.connect(gain);
        gain.gain.value = this.gain;
        return { source, gain };
    }
};
__decorate([
    tsdi_1.inject("AudioContext"),
    __metadata("design:type", AudioContext)
], Audio.prototype, "audioContext", void 0);
Audio = __decorate([
    tsdi_1.external,
    __metadata("design:paramtypes", [String, Number])
], Audio);
exports.Audio = Audio;
//# sourceMappingURL=audio.js.map