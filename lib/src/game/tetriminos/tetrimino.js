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
const utils_1 = require("utils");
const matrix_1 = require("../matrix");
const playfield_1 = require("../playfield");
const cell_color_1 = require("../cell-color");
var Rotation;
(function (Rotation) {
    Rotation[Rotation["DEG_0"] = 0] = "DEG_0";
    Rotation[Rotation["DEG_90"] = 1] = "DEG_90";
    Rotation[Rotation["DEG_180"] = 2] = "DEG_180";
    Rotation[Rotation["DEG_270"] = 3] = "DEG_270";
})(Rotation = exports.Rotation || (exports.Rotation = {}));
let Tetrimino = class Tetrimino {
    constructor(matrix, offset, rotation = Rotation.DEG_0) {
        this.matrix = matrix;
        this.offset = offset;
        this.rotation = rotation;
    }
    initialize() {
        switch (this.rotation) {
            case Rotation.DEG_0: break;
            case Rotation.DEG_90:
                this.matrix = this.matrix.rotateRight();
                break;
            case Rotation.DEG_180:
                this.matrix = this.matrix.rotateRight().rotateRight();
                break;
            case Rotation.DEG_270:
                this.matrix = this.matrix.rotateLeft();
                break;
        }
        this.refreshGhostPosition();
    }
    refreshGhostPosition() {
        this.ghostPosition = this.calculateHardDropOffset().offset;
    }
    attemptRotation(matrix, offset) {
        if (this.playfield.collides(matrix, offset)) {
            return false;
        }
        this.offset = offset;
        this.matrix = matrix;
        return true;
    }
    setRotation(rotation) {
        this.rotation = rotation;
        this.refreshGhostPosition();
    }
    rotateLeft() {
        const newMatrix = this.matrix.rotateLeft();
        switch (this.rotation) {
            case Rotation.DEG_0:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(0, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, -2)))) {
                    this.setRotation(Rotation.DEG_270);
                }
                return;
            case Rotation.DEG_90:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(0, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 2)))) {
                    this.setRotation(Rotation.DEG_0);
                }
                return;
            case Rotation.DEG_180:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(0, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, -2)))) {
                    this.setRotation(Rotation.DEG_90);
                }
                return;
            case Rotation.DEG_270:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(0, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 2)))) {
                    this.setRotation(Rotation.DEG_180);
                }
                return;
        }
    }
    rotateRight() {
        const newMatrix = this.matrix.rotateRight();
        switch (this.rotation) {
            case Rotation.DEG_0:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(0, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, -2)))) {
                    this.setRotation(Rotation.DEG_90);
                }
                return;
            case Rotation.DEG_90:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(0, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 2)))) {
                    this.setRotation(Rotation.DEG_180);
                }
                return;
            case Rotation.DEG_180:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(0, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, -2)))) {
                    this.setRotation(Rotation.DEG_270);
                }
                return;
            case Rotation.DEG_270:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(0, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 2)))) {
                    this.setRotation(Rotation.DEG_0);
                }
                return;
        }
    }
    moveLeft() {
        const newOffset = this.offset.add(utils_1.vec2(-1, 0));
        if (this.playfield.collides(this.matrix, newOffset)) {
            return;
        }
        this.offset = newOffset;
        this.refreshGhostPosition();
    }
    moveDown() {
        const newOffset = this.offset.add(utils_1.vec2(0, -1));
        if (this.playfield.collides(this.matrix, newOffset)) {
            return;
        }
        this.offset = newOffset;
    }
    moveRight() {
        const newOffset = this.offset.add(utils_1.vec2(1, 0));
        if (this.playfield.collides(this.matrix, newOffset)) {
            return;
        }
        this.offset = newOffset;
        this.ghostPosition = this.calculateHardDropOffset().offset;
        this.refreshGhostPosition();
    }
    calculateHardDropOffset() {
        let offset = this.offset;
        let count = 0;
        while (!this.playfield.collides(this.matrix, offset.add(utils_1.vec2(0, -1)))) {
            offset = offset.add(utils_1.vec2(0, -1));
            count++;
        }
        return { offset, count };
    }
    hardDrop() {
        const { offset, count } = this.calculateHardDropOffset();
        this.offset = offset;
        return count;
    }
    overlayedOnMatrix() {
        return this.playfield.overlay(this.matrix, this.offset);
    }
    overlayedOnMatrixWithGhost() {
        return this.playfield
            .overlay(this.matrix.recolor(cell_color_1.CellColor.GHOST), this.ghostPosition)
            .overlay(this.matrix, this.offset);
    }
    hasHitFloor() {
        return this.playfield.collides(this.matrix, this.offset.add(utils_1.vec2(0, -1)));
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", playfield_1.Playfield)
], Tetrimino.prototype, "playfield", void 0);
__decorate([
    tsdi_1.initialize,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Tetrimino.prototype, "initialize", null);
Tetrimino = __decorate([
    tsdi_1.external,
    __metadata("design:paramtypes", [matrix_1.Matrix,
        utils_1.Vec2, Object])
], Tetrimino);
exports.Tetrimino = Tetrimino;
//# sourceMappingURL=tetrimino.js.map