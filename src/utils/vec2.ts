export class Vec2 {
    public static isVec2(obj: any): obj is Vec2 {
        if (typeof obj !== "object") { return false; }
        if (typeof obj.x !== "number") { return false; }
        if (typeof obj.y !== "number") { return false; }
        return true;
    }

    constructor(
        public x: number,
        public y: number,
    ) {}

    public add(other: Vec2): Vec2 {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    public sub(other: Vec2): Vec2 {
        return new Vec2(this.x - other.x, this.y - other.y);
    }

    public get area() {
        return this.x * this.y;
    }

    public swap() {
        return vec2(this.y, this.x);
    }

    public div(other: number | Vec2): Vec2 {
        if (typeof other === "number") {
            return vec2(this.x / other, this.y / other);
        }
        return vec2(this.x / other.x, this.y / other.y);
    }

    public mult(other: number | Vec2): Vec2 {
        if (typeof other === "number") {
            return vec2(this.x * other, this.y * other);
        }
        return vec2(this.x * other.x, this.y * other.y);
    }

    public horizontalCenter(): Vec2 {
        return vec2(Math.floor(this.x / 2), this.y);
    }

    public equals(other: Vec2): boolean {
        return this.x === other.x && this.y === other.y;
    }

    public mod(other: Vec2): Vec2 {
        return vec2(this.x % other.x, this.y % other.y);
    }

    public distance(other: Vec2): number {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    public min() {
        return Math.min(this.x, this.y);
    }
}

export function vec2(x: number, y: number): Vec2 {
    return new Vec2(x, y);
}
