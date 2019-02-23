"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cell_color_1 = require("./cell-color");
const utils_1 = require("utils");
class Matrix {
    static isMatrix(obj) {
        if (typeof obj !== "object") {
            return false;
        }
        return utils_1.Vec2.isVec2(obj.dimensions);
    }
    constructor(arg1, initialization) {
        if (Matrix.isMatrix(arg1)) {
            this.dimensions = arg1.dimensions;
            this.state = new Uint8Array(this.size);
            this.state.set(arg1.state);
        }
        else {
            if (!utils_1.Vec2.isVec2(arg1)) {
                throw new Error("Invalid arguments.");
            }
            this.dimensions = arg1;
            this.state = new Uint8Array(this.size);
            if (initialization) {
                if (initialization.length !== this.size) {
                    throw new Error("Wrong size.");
                }
                initialization.forEach((cellColor, index) => this.state[index] = cellColor);
            }
        }
    }
    get size() {
        return this.dimensions.area;
    }
    at(pos) {
        return this.state[pos.x + (this.dimensions.y - pos.y - 1) * this.dimensions.x];
    }
    put(pos, cellColor) {
        this.state[pos.x + (this.dimensions.y - pos.y - 1) * this.dimensions.x] = cellColor;
    }
    emptyAt(pos) {
        return this.at(pos) === cell_color_1.CellColor.EMPTY || this.at(pos) === cell_color_1.CellColor.GHOST;
    }
    fits(other, offset) {
        if (offset.x < 0) {
            return false;
        }
        if (offset.x + other.dimensions.x > this.dimensions.x) {
            return false;
        }
        if (offset.y < 0) {
            return false;
        }
        if (offset.y + other.dimensions.y > this.dimensions.y) {
            return false;
        }
        return true;
    }
    overlay(other, offset) {
        if (!this.fits(other, offset)) {
            throw new Error("Can't overlay.");
        }
        const result = new Matrix(this);
        for (let x = 0; x < other.dimensions.x; ++x) {
            for (let y = 0; y < other.dimensions.y; ++y) {
                const otherCellColor = other.at(utils_1.vec2(x, y));
                if (otherCellColor !== cell_color_1.CellColor.EMPTY) {
                    result.put(utils_1.vec2(x, y).add(offset), otherCellColor);
                }
            }
        }
        return result;
    }
    collides(other, offset) {
        if (!this.fits(other, offset)) {
            return true;
        }
        for (let x = 0; x < other.dimensions.x; ++x) {
            for (let y = 0; y < other.dimensions.y; ++y) {
                if (!this.emptyAt(utils_1.vec2(x, y).add(offset)) && !other.emptyAt(utils_1.vec2(x, y))) {
                    return true;
                }
            }
        }
        return false;
    }
    rotateLeft() {
        // Create transposed version of matrix.
        const result = new Matrix(this.dimensions.swap());
        for (let x = 0; x < this.dimensions.x; ++x) {
            for (let y = 0; y < this.dimensions.y; ++y) {
                result.put(utils_1.vec2(this.dimensions.y - y - 1, x), this.at(utils_1.vec2(x, y)));
            }
        }
        return result;
    }
    rotateRight() {
        // Create transposed version of matrix.
        const result = new Matrix(this.dimensions.swap());
        for (let x = 0; x < this.dimensions.x; ++x) {
            for (let y = 0; y < this.dimensions.y; ++y) {
                result.put(utils_1.vec2(y, this.dimensions.x - x - 1), this.at(utils_1.vec2(x, y)));
            }
        }
        return result;
    }
    rotate180() {
        const result = new Matrix(this.dimensions);
        for (let x = 0; x < this.dimensions.x; ++x) {
            for (let y = 0; y < this.dimensions.y; ++y) {
                result.put(utils_1.vec2(this.dimensions.x - x - 1, this.dimensions.y - y - 1), this.at(utils_1.vec2(x, y)));
            }
        }
        return result;
    }
    removeHorizontals() {
        const matrix = new Matrix(this);
        const { fullHorizontals } = matrix;
        const count = fullHorizontals.length;
        while (fullHorizontals.length > 0) {
            const current = fullHorizontals.shift();
            matrix.removeHorizontal(current);
            fullHorizontals.forEach((y, index) => fullHorizontals[index] = y - 1);
        }
        return { matrix, count };
    }
    get fullHorizontals() {
        const lines = [];
        for (let y = 0; y < this.dimensions.y; ++y) {
            let fullHorizontal = true;
            for (let x = 0; x < this.dimensions.x; ++x) {
                if (this.emptyAt(utils_1.vec2(x, y))) {
                    fullHorizontal = false;
                    break;
                }
            }
            if (fullHorizontal) {
                lines.push(y);
            }
        }
        return lines;
    }
    removeHorizontal(targetY) {
        for (let y = targetY; y < this.dimensions.y; ++y) {
            for (let x = 0; x < this.dimensions.x; ++x) {
                if (y === this.dimensions.y - 1) {
                    this.put(utils_1.vec2(x, y), cell_color_1.CellColor.EMPTY);
                }
                else {
                    this.put(utils_1.vec2(x, y), this.at(utils_1.vec2(x, y + 1)));
                }
            }
        }
    }
    equals(other) {
        if (this.dimensions.x !== other.dimensions.x || this.dimensions.y !== other.dimensions.y) {
            return false;
        }
        for (let y = 0; y < this.dimensions.y - 1; ++y) {
            for (let x = 0; x < this.dimensions.x; ++x) {
                if (this.at(utils_1.vec2(x, y)) !== other.at(utils_1.vec2(x, y))) {
                    return false;
                }
            }
        }
        return true;
    }
    toString() {
        let result = "";
        for (let y = this.dimensions.y - 1; y >= 0; --y) {
            for (let x = 0; x < this.dimensions.x; ++x) {
                result += this.at(utils_1.vec2(x, y));
                if (x !== this.dimensions.x - 1) {
                    result += " ";
                }
                else {
                    result += "\n";
                }
            }
        }
        return result;
    }
    update(matrix) {
        if (!matrix.dimensions.equals(this.dimensions)) {
            throw new Error("Can't update with different dimensions.");
        }
        this.state.set(matrix.state);
    }
    recolor(cellColor) {
        const result = new Matrix(this);
        for (let x = 0; x < result.dimensions.x; ++x) {
            for (let y = 0; y < result.dimensions.y; ++y) {
                result.put(utils_1.vec2(x, y), result.emptyAt(utils_1.vec2(x, y)) ? cell_color_1.CellColor.EMPTY : cellColor);
            }
        }
        return result;
    }
}
exports.Matrix = Matrix;
//# sourceMappingURL=matrix.js.map