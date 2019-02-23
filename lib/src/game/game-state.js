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
const mobx_1 = require("mobx");
const date_fns_1 = require("date-fns");
const lodash_decorators_1 = require("lodash-decorators");
const shuffle_bag_1 = require("./shuffle-bag");
const config_1 = require("config");
const speed_1 = require("./speed");
const playfield_1 = require("./playfield");
const audio_1 = require("audio");
const scoring_1 = require("./scoring");
let GameState = class GameState {
    constructor() {
        this.lines = 0;
        this.score = 0;
        this.debug = false;
        this.running = false;
        this.comboCount = 0;
    }
    initialize() {
        this.initialized = new Date();
        this.lastTick = new Date();
        this.newTetrimino();
    }
    get seconds() {
        if (!this.timeStarted) {
            return 0;
        }
        return date_fns_1.differenceInMilliseconds(new Date(), this.timeStarted) / 100;
    }
    get speed() { return speed_1.speed(this.level); }
    processMatrix() {
        const now = new Date();
        const diff = date_fns_1.differenceInMilliseconds(now, this.lastTick) / 1000;
        if (diff > this.speed || this.current.hardDrops) {
            this.lastTick = now;
            if (this.current.tetrimino.hasHitFloor()) {
                this.commitTetrimino();
            }
            this.moveTetrimino();
        }
    }
    update() {
        if (!this.running) {
            return;
        }
        this.processMatrix();
        this.timeout = setTimeout(this.update, this.config.tickSpeed * 1000);
        if (this.debug) {
            console.log(this.temporaryState.toString()); // tslint:disable-line
        }
    }
    get level() {
        const linesPerLevel = this.debug ? 2 : 10;
        return Math.floor(this.lines / linesPerLevel);
    }
    inputRotateRight() {
        this.sounds.play(audio_1.AudioRotate);
        this.current.tetrimino.rotateRight();
    }
    inputRotateLeft() {
        this.sounds.play(audio_1.AudioRotate);
        this.current.tetrimino.rotateLeft();
    }
    inputMoveLeft() {
        this.current.tetrimino.moveLeft();
        this.sounds.play(audio_1.AudioMoveDown);
    }
    inputMoveRight() {
        this.current.tetrimino.moveRight();
        this.sounds.play(audio_1.AudioMoveDown);
    }
    inputMoveDown() {
        this.current.softDrops++;
        this.current.tetrimino.moveDown();
        this.sounds.play(audio_1.AudioMoveDown);
    }
    inputHardDrop() {
        this.current.hardDrops = this.current.tetrimino.hardDrop();
    }
    moveTetrimino() { this.current.tetrimino.moveDown(); }
    newTetrimino() {
        this.current = {
            tetrimino: this.shuffleBag.take(),
            softDrops: 0,
            hardDrops: 0,
        };
    }
    handleLevelUp() {
        this.sounds.play(audio_1.AudioLevelUp);
        setTimeout(() => {
            this.sounds.changeMusicSpeed(audio_1.musicSpeedForLevel(this.level));
        }, 100);
    }
    playScoreSound(count) {
        switch (count) {
            default:
            case 0:
                break;
            case 1:
                this.sounds.play(audio_1.AudioScore1);
                break;
            case 2:
                this.sounds.play(audio_1.AudioScore2);
                break;
            case 3:
                this.sounds.play(audio_1.AudioScore3);
                break;
            case 4:
                this.sounds.play(audio_1.AudioScore4);
                break;
        }
    }
    commitTetrimino() {
        this.sounds.play(audio_1.AudioHit);
        this.playfield.update(this.current.tetrimino.overlayedOnMatrix());
        const { matrix, count } = this.playfield.removeHorizontals();
        if (count > 0) {
            this.comboCount++;
            this.playfield.update(matrix);
            const oldLevel = this.level;
            this.lines += count;
            if (this.level > oldLevel) {
                this.handleLevelUp();
            }
            else {
                this.playScoreSound(count);
            }
            this.scoreLineCount(count);
        }
        else {
            const { level, comboCount } = this;
            if (this.comboCount >= 2) {
                this.awardScore({
                    action: scoring_1.ScoreActionType.COMBO,
                    level,
                    comboCount,
                });
                this.comboCount = 0;
            }
        }
        this.lastHit = new Date();
        this.newTetrimino();
    }
    get timeSinceLastHit() {
        if (!this.lastHit) {
            return Number.POSITIVE_INFINITY;
        }
        return date_fns_1.differenceInMilliseconds(new Date(), this.lastHit) / 1000;
    }
    awardScore(action) {
        this.score += scoring_1.scorePointValue(action);
    }
    scoreLineCount(count) {
        const { level } = this;
        switch (count) {
            case 1: this.awardScore({ action: scoring_1.ScoreActionType.SINGLE, level });
            case 2: this.awardScore({ action: scoring_1.ScoreActionType.DOUBLE, level });
            case 3: this.awardScore({ action: scoring_1.ScoreActionType.TRIPLE, level });
            case 4: this.awardScore({ action: scoring_1.ScoreActionType.TETRIS, level });
        }
        if (this.current.hardDrops) {
            this.awardScore({ action: scoring_1.ScoreActionType.HARD_DROP, cells: this.current.hardDrops });
        }
        if (this.current.softDrops) {
            this.awardScore({ action: scoring_1.ScoreActionType.SOFT_DROP, cells: this.current.softDrops });
        }
    }
    get temporaryState() { return this.current.tetrimino.overlayedOnMatrixWithGhost(); }
    start() {
        this.running = true;
        this.update();
        this.timeStarted = new Date();
    }
    stop() {
        this.running = false;
        if (typeof this.timeout === "number" && this.timeout > -1) {
            clearTimeout(this.timeout);
        }
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", config_1.Config)
], GameState.prototype, "config", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", shuffle_bag_1.ShuffleBag)
], GameState.prototype, "shuffleBag", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", playfield_1.Playfield)
], GameState.prototype, "playfield", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", audio_1.Sounds)
], GameState.prototype, "sounds", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], GameState.prototype, "lines", void 0);
__decorate([
    mobx_1.observable,
    __metadata("design:type", Object)
], GameState.prototype, "score", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameState.prototype, "initialize", null);
__decorate([
    lodash_decorators_1.bind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameState.prototype, "update", null);
__decorate([
    mobx_1.computed,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], GameState.prototype, "level", null);
GameState = __decorate([
    tsdi_1.component
], GameState);
exports.GameState = GameState;
//# sourceMappingURL=game-state.js.map