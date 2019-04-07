import { CellColor } from "types";
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
    constructor(dimensions: Vec2, base64: string);
    constructor(arg1: Matrix | Vec2, initialization?: CellColor[] | string) {
        if (Matrix.isMatrix(arg1)) {
            this.dimensions = arg1.dimensions;
            this.state = new Uint8Array(this.size);
            this.state.set(arg1.state);
        } else {
            if (!Vec2.isVec2(arg1)) { throw new Error("Invalid arguments."); }
            this.dimensions = arg1;
            this.state = new Uint8Array(this.size);
            if (initialization) {
                if (typeof initialization === "string") {
                    const binaryString = atob(initialization);
                    if (binaryString.length !== this.size) { throw new Error("Wrong size."); }
                    for (let index = 0; index < binaryString.length; ++index) {
                        this.state[index] = binaryString.charCodeAt(index);
                    }
                } else {
                    if (initialization.length !== this.size) { throw new Error("Wrong size."); }
                    initialization.forEach((cellColor, index) => this.state[index] = cellColor);
                }
            }
        }
    }

    public clear() {
        for (let i = 0; i < this.state.length; ++i) { this.state[i] = 0; }
    }

    public get size() {
        return this.dimensions.area;
    }

    public at(pos: Vec2): CellColor {
        return this.state[pos.x + (this.dimensions.y - pos.y - 1) * this.dimensions.x];
    }

    protected put(pos: Vec2, cellColor: CellColor) {
        this.state[pos.x + (this.dimensions.y - pos.y - 1) * this.dimensions.x] = cellColor;
    }

    public emptyAt(pos: Vec2): boolean {
        return this.at(pos) === CellColor.EMPTY || this.at(pos) === CellColor.GHOST;
    }

    public isInside(pos: Vec2): boolean {
        return pos.x >= 0 && pos.x < this.dimensions.x && pos.y >= 0 && pos.y < this.dimensions.y;
    }

    public overlay(other: Matrix, offset: Vec2): Matrix {
        const result = new Matrix(this);
        for (let x = 0; x < other.dimensions.x; ++x) {
            for (let y = 0; y < other.dimensions.y; ++y) {
                const pos = vec2(x, y).add(offset);
                if (result.isInside(pos)) {
                    const otherCellColor = other.at(vec2(x, y));
                    if (otherCellColor !== CellColor.EMPTY) {
                        result.put(pos, otherCellColor);
                    }
                }
            }
        }
        return result;
    }

    public collides(other: Matrix, offset: Vec2): boolean {
        for (let x = 0; x < other.dimensions.x; ++x) {
            for (let y = 0; y < other.dimensions.y; ++y) {
                const pos = vec2(x, y).add(offset);
                if (!this.isInside(pos)) {
                    if (!other.emptyAt(vec2(x, y))) { return true; }
                } else {
                    if (!this.emptyAt(pos) && !other.emptyAt(vec2(x, y))) { return true; }
                }
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

    public removeHorizontals(): { matrix: Matrix, offsets: number[] } {
        const matrix = new Matrix(this);
        const { fullHorizontals } = matrix;
        const offsets = [...fullHorizontals];
        while (fullHorizontals.length > 0) {
            const current = fullHorizontals.shift();
            matrix.removeHorizontal(current!);
            fullHorizontals.forEach((y, index) => fullHorizontals[index] = y - 1);
        }
        return { matrix, offsets };
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

    public hasAny(cellColor: CellColor): boolean {
        for (let i = 0; i < this.state.length; ++i) {
            if (this.state[i] === cellColor) { return true; }
        }
        return false;
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

    public toBase64(): string {
        return btoa(String.fromCharCode(...this.state));
    }

    public moveUp(lines: number) {
        const result = new Matrix(this);
        for (let y = result.dimensions.y - 1; y >= 0; --y) {
            for (let x = 0; x < result.dimensions.x; ++x) {
                if (y + lines < 0) {
                    result.put(vec2(x, y), CellColor.EMPTY);
                } else {
                    result.put(vec2(x, y), this.at(vec2(x, y - lines)));
                }
            }
        }
        return result;
    }

    public get highestBlock() {
        let y: number;
        for (y = this.dimensions.y - 1; y >= 0; --y) {
            for (let x = 0; x < this.dimensions.x; ++x) {
                if (!this.emptyAt(vec2(x, y))) { return y; }
            }
        }
        return 0;
    }

    public get holes() {
        let todo: Vec2[] = [];
        let holes = 0;

        for (let x = 0; x < this.dimensions.x; ++x) {
            for (let y = 0; y < this.dimensions.y - 1; ++y) {
                const vec = vec2(x, y);
                if (this.emptyAt(vec)) { todo.push(vec); }
            }
        }

        while (todo.length > 0) {
            const current = todo[0];
            let visited: Vec2[] = [];

            const isConnectedToTop = (vec: Vec2): boolean => {
                if (visited.some(visitedVec => visitedVec.equals(vec))) { return false; }
                todo = todo.filter(todoVec => !todoVec.equals(vec));
                visited.push(vec);
                if (!this.isInside(vec)) { return false; }
                if (!this.emptyAt(vec)) { return false; }
                if (vec.y === this.dimensions.y - 1) { return true; }
                return (
                    isConnectedToTop(vec.add(vec2(1, 0))) ||
                    isConnectedToTop(vec.add(vec2(-1, 0))) ||
                    isConnectedToTop(vec.add(vec2(0, 1))) ||
                    isConnectedToTop(vec.add(vec2(0, -1)))
                );
            };
            if (!isConnectedToTop(current)) { holes++; }
        }

        return holes;
    }
}
