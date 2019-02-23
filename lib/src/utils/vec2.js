"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static isVec2(obj) {
        if (typeof obj !== "object") {
            return false;
        }
        if (typeof obj.x !== "number") {
            return false;
        }
        if (typeof obj.y !== "number") {
            return false;
        }
        return true;
    }
    add(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }
    sub(other) {
        return new Vec2(this.x - other.x, this.y - other.y);
    }
    get area() {
        return this.x * this.y;
    }
    swap() {
        return vec2(this.y, this.x);
    }
    div(other) {
        if (typeof other === "number") {
            return vec2(this.x / other, this.y / other);
        }
        return vec2(this.x / other.x, this.y / other.y);
    }
    mult(other) {
        if (typeof other === "number") {
            return vec2(this.x * other, this.y * other);
        }
        return vec2(this.x * other.x, this.y * other.y);
    }
    horizontalCenter() {
        return vec2(Math.floor(this.x / 2), this.y);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    mod(other) {
        return vec2(this.x % other.x, this.y % other.y);
    }
}
exports.Vec2 = Vec2;
function vec2(x, y) {
    return new Vec2(x, y);
}
exports.vec2 = vec2;
//# sourceMappingURL=vec2.js.map