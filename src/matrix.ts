import { CellColor } from "./cell-color";
import { vec2, Vec2 } from "./vec2";

export class Matrix {
    static isMatrix(obj: any): obj is Matrix {
        if (typeof obj !== "object") { return false; }
        return typeof obj.width === "number" && typeof obj.height === "number";
    }

    public width: number;
    public height: number;
    private state: Uint8Array;

    constructor(matrix: Matrix);
    constructor(width: number, height: number, initialization?: CellColor[]);
    constructor(arg1: Matrix | number, arg2?: number, initialization?: CellColor[]) {
        if (Matrix.isMatrix(arg1)) {
            this.width = arg1.width;
            this.height = arg1.height;
            this.state = new Uint8Array(this.size);
            this.state.set(arg1.state);
        } else {
            this.width = arg1;
            this.height = arg2;
            this.state = new Uint8Array(this.size);
            if (initialization) {
                if (initialization.length !== this.size) { throw new Error("Wrong size."); }
                initialization.forEach((cellColor, index) => this.state[index] = cellColor);
            }
        }
    }

    public get size() {
        return this.width * this.height;
    }

    public at(pos: Vec2): CellColor {
        return this.state[pos.x + (this.height - pos.y - 1) * this.width];
    }

    private put(pos: Vec2, cellColor: CellColor) {
        this.state[pos.x + (this.height - pos.y - 1) * this.width] = cellColor;
    }

    public emptyAt(pos: Vec2): boolean {
        return this.at(pos) === CellColor.EMPTY;
    }

    public fits(other: Matrix, offset: Vec2): boolean {
        if (offset.x < 0) { return false; }
        if (offset.x + other.width > this.width) { return false; }
        if (offset.y < 0) { return false; }
        if (offset.y + other.height > this.height) { return false; }
        return true;
    }

    public overlay(other: Matrix, offset: Vec2): Matrix {
        if (!this.fits(other, offset)) { throw new Error("Can't overlay."); }
        const result = new Matrix(this);
        for (let x = 0; other.width; ++x) {
            for (let y = 0; other.height; ++y) {
                result.put(vec2(x, y).add(offset), other.at(vec2(x, y)));
            }
        }
        return result;
    }

    public collides(other: Matrix, offset: Vec2): boolean {
        if (!this.fits(other, offset)) { throw new Error("Can't overlay."); }
        for (let x = 0; other.width; ++x) {
            for (let y = 0; other.height; ++y) {
                if (!this.emptyAt(vec2(x, y).add(offset)) && !other.emptyAt(vec2(x, y))) { return false; }
            }
        }
        return true;
    }

    public rotateLeft(): Matrix {
        // Create transposed version of matrix.
        const result = new Matrix(this.height, this.width);
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                result.put(vec2(this.height - y - 1, x), this.at(vec2(x, y)));
            }
        }
        return result;
    }

    public rotateRight(): Matrix {
        // Create transposed version of matrix.
        const result = new Matrix(this.height, this.width);
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                result.put(vec2(y, this.width - x - 1), this.at(vec2(x, y)));
            }
        }
        return result;
    }

    public rotate180(): Matrix {
        const result = new Matrix(this.width, this.height);
        for (let x = 0; x < this.width; ++x) {
            for (let y = 0; y < this.height; ++y) {
                result.put(vec2(this.width - x - 1, this.height - y - 1), this.at(vec2(x, y)));
            }
        }
        return result;
    }

    public removeHorizontals(): Matrix {
        const result = new Matrix(this);
        const { fullHorizontals } = result;
        while (fullHorizontals.length > 0) {
            const current = fullHorizontals.shift();
            result.removeHorizontal(current);
            fullHorizontals.forEach((y, index) => fullHorizontals[index] = y - 1);
        }
        return result;
    }

    public get fullHorizontals(): number[] {
        const lines: number[] = [];
        for (let y = 0; y < this.height; ++y) {
            let fullHorizontal = true;
            for (let x = 0; x < this.width; ++x) {
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
        for (let y = targetY; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                if (y === this.height - 1) {
                    this.put(vec2(x, y), CellColor.EMPTY);
                } else {
                    this.put(vec2(x, y), this.at(vec2(x, y + 1)));
                }
            }
        }
    }

    public equals(other: Matrix): boolean {
        if (this.width !== other.width || this.height !== other.height) { return false; }
        for (let y = 0; y < this.height - 1; ++y) {
            for (let x = 0; x < this.width; ++x) {
                if (this.at(vec2(x, y)) !== other.at(vec2(x, y))) { return false; }
            }
        }
        return true;
    }

    public toString(): string {
        let result = "";
        for (let y = this.height - 1; y >= 0; --y) {
            for (let x = 0; x < this.width; ++x) {
                result += this.at(vec2(x, y));
                if (x !== this.width - 1) { result += " "; }
                else { result += "\n"; }
            }
        }
        return result;
    }
}
