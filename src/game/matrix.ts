import { CellColor } from "./cell-color";
import { vec2, Vec2 } from "utils";

export class Matrix {
    public static isMatrix(obj: any): obj is Matrix {
        if (typeof obj !== "object") { return false; }
        return Vec2.isVec2(obj.dimensions);
    }

    public dimensions: Vec2;
    private state: Uint8Array;

    constructor(matrix: Matrix);
    constructor(dimensions: Vec2, initialization?: CellColor[]);
    constructor(arg1: Matrix | Vec2, initialization?: CellColor[]) {
        if (Matrix.isMatrix(arg1)) {
            this.dimensions = arg1.dimensions;
            this.state = new Uint8Array(this.size);
            this.state.set(arg1.state);
        } else {
            if (!Vec2.isVec2(arg1)) { throw new Error("Invalid arguments."); }
            this.dimensions = arg1;
            this.state = new Uint8Array(this.size);
            if (initialization) {
                if (initialization.length !== this.size) { throw new Error("Wrong size."); }
                initialization.forEach((cellColor, index) => this.state[index] = cellColor);
            }
        }
    }

    public get size() {
        return this.dimensions.area;
    }

    public at(pos: Vec2): CellColor {
        return this.state[pos.x + (this.dimensions.y - pos.y - 1) * this.dimensions.x];
    }

    private put(pos: Vec2, cellColor: CellColor) {
        this.state[pos.x + (this.dimensions.y - pos.y - 1) * this.dimensions.x] = cellColor;
    }

    public emptyAt(pos: Vec2): boolean {
        return this.at(pos) === CellColor.EMPTY || this.at(pos) === CellColor.GHOST;
    }

    public fits(other: Matrix, offset: Vec2): boolean {
        if (offset.x < 0) { return false; }
        if (offset.x + other.dimensions.x > this.dimensions.x) { return false; }
        if (offset.y < 0) { return false; }
        if (offset.y + other.dimensions.y > this.dimensions.y) { return false; }
        return true;
    }

    public overlay(other: Matrix, offset: Vec2): Matrix {
        if (!this.fits(other, offset)) { throw new Error("Can't overlay."); }
        const result = new Matrix(this);
        for (let x = 0; x < other.dimensions.x; ++x) {
            for (let y = 0; y < other.dimensions.y; ++y) {
                const otherCellColor = other.at(vec2(x, y));
                if (otherCellColor !== CellColor.EMPTY) {
                    result.put(vec2(x, y).add(offset), otherCellColor);
                }
            }
        }
        return result;
    }

    public collides(other: Matrix, offset: Vec2): boolean {
        if (!this.fits(other, offset)) { return true; }
        for (let x = 0; x < other.dimensions.x; ++x) {
            for (let y = 0; y < other.dimensions.y; ++y) {
                if (!this.emptyAt(vec2(x, y).add(offset)) && !other.emptyAt(vec2(x, y))) { return true; }
            }
        }
        return false;
    }

    public rotateLeft(): Matrix {
        // Create transposed version of matrix.
        const result = new Matrix(this.dimensions.swap());
        for (let x = 0; x < this.dimensions.x; ++x) {
            for (let y = 0; y < this.dimensions.y; ++y) {
                result.put(vec2(this.dimensions.y - y - 1, x), this.at(vec2(x, y)));
            }
        }
        return result;
    }

    public rotateRight(): Matrix {
        // Create transposed version of matrix.
        const result = new Matrix(this.dimensions.swap());
        for (let x = 0; x < this.dimensions.x; ++x) {
            for (let y = 0; y < this.dimensions.y; ++y) {
                result.put(vec2(y, this.dimensions.x - x - 1), this.at(vec2(x, y)));
            }
        }
        return result;
    }

    public rotate180(): Matrix {
        const result = new Matrix(this.dimensions);
        for (let x = 0; x < this.dimensions.x; ++x) {
            for (let y = 0; y < this.dimensions.y; ++y) {
                result.put(vec2(this.dimensions.x - x - 1, this.dimensions.y - y - 1), this.at(vec2(x, y)));
            }
        }
        return result;
    }

    public removeHorizontals(): { matrix: Matrix, count: number } {
        const matrix = new Matrix(this);
        const { fullHorizontals } = matrix;
        const count = fullHorizontals.length;
        while (fullHorizontals.length > 0) {
            const current = fullHorizontals.shift();
            matrix.removeHorizontal(current!);
            fullHorizontals.forEach((y, index) => fullHorizontals[index] = y - 1);
        }
        return { matrix, count };
    }

    public get fullHorizontals(): number[] {
        const lines: number[] = [];
        for (let y = 0; y < this.dimensions.y; ++y) {
            let fullHorizontal = true;
            for (let x = 0; x < this.dimensions.x; ++x) {
                if (this.emptyAt(vec2(x, y))) {
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

    public removeHorizontal(targetY: number) {
        for (let y = targetY; y < this.dimensions.y; ++y) {
            for (let x = 0; x < this.dimensions.x; ++x) {
                if (y === this.dimensions.y - 1) {
                    this.put(vec2(x, y), CellColor.EMPTY);
                } else {
                    this.put(vec2(x, y), this.at(vec2(x, y + 1)));
                }
            }
        }
    }

    public equals(other: Matrix): boolean {
        if (this.dimensions.x !== other.dimensions.x || this.dimensions.y !== other.dimensions.y) { return false; }
        for (let y = 0; y < this.dimensions.y - 1; ++y) {
            for (let x = 0; x < this.dimensions.x; ++x) {
                if (this.at(vec2(x, y)) !== other.at(vec2(x, y))) { return false; }
            }
        }
        return true;
    }

    public toString(): string {
        let result = "";
        for (let y = this.dimensions.y - 1; y >= 0; --y) {
            for (let x = 0; x < this.dimensions.x; ++x) {
                result += this.at(vec2(x, y));
                if (x !== this.dimensions.x - 1) { result += " "; }
                else { result += "\n"; }
            }
        }
        return result;
    }

    public update(matrix: Matrix) {
        if (!matrix.dimensions.equals(this.dimensions)) { throw new Error("Can't update with different dimensions."); }
        this.state.set(matrix.state);
    }

    public recolor(cellColor: CellColor): Matrix {
        const result = new Matrix(this);
        for (let x = 0; x < result.dimensions.x; ++x) {
            for (let y = 0; y < result.dimensions.y; ++y) {
                result.put(vec2(x, y), result.emptyAt(vec2(x, y)) ? CellColor.EMPTY : cellColor);
            }
        }
        return result;
    }
}
