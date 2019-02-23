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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsdi_1 = require("tsdi");
const matrix_1 = require("../matrix");
const utils_1 = require("utils");
const matrix_initializer_1 = require("./matrix-initializer");
const cell_color_1 = require("../cell-color");
const tetrimino_1 = require("./tetrimino");
const config_1 = require("config");
class TetriminoMatrixI extends matrix_1.Matrix {
    constructor() {
        super(utils_1.vec2(1, 4), matrix_initializer_1.matrixInitializer(cell_color_1.CellColor.TETRIMINO_I, [
            1,
            1,
            1,
            1,
        ]));
    }
}
exports.TetriminoMatrixI = TetriminoMatrixI;
let TetriminoI = class TetriminoI extends tetrimino_1.Tetrimino {
    constructor(config) {
        super(new TetriminoMatrixI(), config.logicalSize.horizontalCenter().add(utils_1.vec2(0, -4)));
    }
    rotateLeft() {
        const newMatrix = this.matrix.rotateLeft();
        switch (this.rotation) {
            case tetrimino_1.Rotation.DEG_0:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(2, -1)))) {
                    this.setRotation(tetrimino_1.Rotation.DEG_270);
                }
                return;
            case tetrimino_1.Rotation.DEG_90:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(2, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, -2)))) {
                    this.setRotation(tetrimino_1.Rotation.DEG_0);
                }
                return;
            case tetrimino_1.Rotation.DEG_180:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-2, 1)))) {
                    this.setRotation(tetrimino_1.Rotation.DEG_90);
                }
                return;
            case tetrimino_1.Rotation.DEG_270:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-2, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 2)))) {
                    this.setRotation(tetrimino_1.Rotation.DEG_180);
                }
                return;
        }
    }
    rotateRight() {
        const newMatrix = this.matrix.rotateRight();
        switch (this.rotation) {
            case tetrimino_1.Rotation.DEG_0:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-2, -1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 2)))) {
                    this.setRotation(tetrimino_1.Rotation.DEG_90);
                }
                return;
            case tetrimino_1.Rotation.DEG_90:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(2, 1)))) {
                    this.setRotation(tetrimino_1.Rotation.DEG_180);
                }
                return;
            case tetrimino_1.Rotation.DEG_180:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(2, 1))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-1, -2)))) {
                    this.setRotation(tetrimino_1.Rotation.DEG_270);
                }
                return;
            case tetrimino_1.Rotation.DEG_270:
                if (this.attemptRotation(newMatrix, this.offset) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(2, 0))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(1, -2))) ||
                    this.attemptRotation(newMatrix, this.offset.add(utils_1.vec2(-2, -1)))) {
                    this.setRotation(tetrimino_1.Rotation.DEG_0);
                }
                return;
        }
    }
};
TetriminoI = __decorate([
    tsdi_1.external,
    __param(0, tsdi_1.inject),
    __metadata("design:paramtypes", [config_1.Config])
], TetriminoI);
exports.TetriminoI = TetriminoI;
//# sourceMappingURL=tetrimino-i.js.map