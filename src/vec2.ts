export class Vec2 {
    static isVec2(obj: any): obj is Vec2 {
        if (typeof obj !== "object") { return false; }
        if (typeof obj.x !== "number") { return false; }
        if (typeof obj.y !== "number") { return false; }
        return true;
    }

    constructor(
        public x: number,
        public y: number,
    ) {}

    public add(vec2: Vec2): Vec2 {
        return new Vec2(this.x + vec2.x, this.y + vec2.y);
    }

    public get area() {
        return this.x * this.y;
    }

    public swap() {
        return vec2(this.y, this.x);
    }
    public mult(scalar: number): Vec2 {
        return vec2(this.x * scalar, this.y * scalar);
    }
}

export function vec2(x: number, y: number): Vec2 {
    return new Vec2(x, y);
}
