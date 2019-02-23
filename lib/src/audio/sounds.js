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
const audio_manager_1 = require("./audio-manager");
const audio_music_120bpm_1 = require("./audio-music-120bpm");
const audio_music_130bpm_1 = require("./audio-music-130bpm");
const audio_music_140bpm_1 = require("./audio-music-140bpm");
const audio_music_150bpm_1 = require("./audio-music-150bpm");
const audio_music_160bpm_1 = require("./audio-music-160bpm");
const audio_music_170bpm_1 = require("./audio-music-170bpm");
var MusicSpeed;
(function (MusicSpeed) {
    MusicSpeed[MusicSpeed["BPM_120"] = 0] = "BPM_120";
    MusicSpeed[MusicSpeed["BPM_130"] = 1] = "BPM_130";
    MusicSpeed[MusicSpeed["BPM_140"] = 2] = "BPM_140";
    MusicSpeed[MusicSpeed["BPM_150"] = 3] = "BPM_150";
    MusicSpeed[MusicSpeed["BPM_160"] = 4] = "BPM_160";
    MusicSpeed[MusicSpeed["BPM_170"] = 5] = "BPM_170";
})(MusicSpeed = exports.MusicSpeed || (exports.MusicSpeed = {}));
function musicForSpeed(musicSpeed) {
    switch (musicSpeed) {
        case MusicSpeed.BPM_120: return audio_music_120bpm_1.AudioMusic120Bpm;
        case MusicSpeed.BPM_130: return audio_music_130bpm_1.AudioMusic130Bpm;
        case MusicSpeed.BPM_140: return audio_music_140bpm_1.AudioMusic140Bpm;
        case MusicSpeed.BPM_150: return audio_music_150bpm_1.AudioMusic150Bpm;
        case MusicSpeed.BPM_160: return audio_music_160bpm_1.AudioMusic160Bpm;
        case MusicSpeed.BPM_170: return audio_music_170bpm_1.AudioMusic170Bpm;
    }
}
function musicSpeedForLevel(level) {
    if (level < 2) {
        return MusicSpeed.BPM_120;
    }
    if (level < 4) {
        return MusicSpeed.BPM_130;
    }
    if (level < 8) {
        return MusicSpeed.BPM_140;
    }
    if (level < 12) {
        return MusicSpeed.BPM_150;
    }
    if (level < 16) {
        return MusicSpeed.BPM_160;
    }
    return MusicSpeed.BPM_170;
}
exports.musicSpeedForLevel = musicSpeedForLevel;
let Sounds = class Sounds {
    constructor() {
        this.timeStarted = 0;
    }
    get musicAudio() {
        if (typeof this.musicSpeed !== "number") {
            return;
        }
        return this.audioManager.audio(musicForSpeed(this.musicSpeed));
    }
    initialize() {
        this.timeStarted = this.audioContext.currentTime;
        this.changeMusicSpeed(MusicSpeed.BPM_120);
    }
    play(audioClass) {
        const audio = this.audioManager.audio(audioClass);
        const { gain, source } = audio.createSource();
        gain.connect(this.audioContext.destination);
        source.start();
    }
    get time() {
        return this.audioContext.currentTime - this.timeStarted;
    }
    get relativeMusicPosition() {
        if (!this.musicAudio) {
            return;
        }
        const { duration } = this.musicAudio;
        const timeInMusic = this.time % duration;
        return timeInMusic / duration;
    }
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.source.stop();
            this.currentMusic.source.disconnect();
            this.currentMusic.gain.disconnect();
        }
    }
    changeMusicSpeed(speed) {
        if (speed === this.musicSpeed) {
            return;
        }
        const { relativeMusicPosition } = this;
        this.stopMusic();
        this.musicSpeed = speed;
        const music = this.musicAudio.createSource();
        const { gain, source } = music;
        this.currentMusic = music;
        gain.connect(this.audioContext.destination);
        source.loop = true;
        source.start(0, relativeMusicPosition ? this.musicAudio.duration * relativeMusicPosition : 0);
        this.timeStarted = this.audioContext.currentTime;
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", audio_manager_1.AudioManager)
], Sounds.prototype, "audioManager", void 0);
__decorate([
    tsdi_1.inject("AudioContext"),
    __metadata("design:type", AudioContext)
], Sounds.prototype, "audioContext", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Sounds.prototype, "initialize", null);
Sounds = __decorate([
    tsdi_1.component
], Sounds);
exports.Sounds = Sounds;
//# sourceMappingURL=sounds.js.map