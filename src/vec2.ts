export class Vec2 {
    constructor(
        public x: number,
        public y: number,
    ) {}

    public add(vec2: Vec2): Vec2 {
        return new Vec2(this.x + vec2.x, this.y + vec2.y);
    }
}

export function vec2(x: number, y: number): Vec2 {
    return new Vec2(x, y);
}
