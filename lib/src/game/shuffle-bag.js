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
const tetriminos_1 = require("./tetriminos");
function shuffle(array) {
    const result = [];
    while (array.length > 0) {
        const index = Math.floor(Math.random() * array.length);
        const [element] = array.splice(index, 1);
        result.push(element);
    }
    return result;
}
let ShuffleBag = class ShuffleBag {
    constructor() {
        this.sequence = [];
        this.refill();
    }
    take() {
        const nextTetrimino = this.sequence.shift();
        if (this.sequence.length <= 7) {
            this.refill();
        }
        return new nextTetrimino();
    }
    get nextFive() {
        return this.sequence.slice(0, 5);
    }
    refill() {
        this.sequence.push(...shuffle([
            tetriminos_1.TetriminoI,
            tetriminos_1.TetriminoJ,
            tetriminos_1.TetriminoL,
            tetriminos_1.TetriminoO,
            tetriminos_1.TetriminoS,
            tetriminos_1.TetriminoT,
            tetriminos_1.TetriminoZ,
        ]));
    }
};
ShuffleBag = __decorate([
    tsdi_1.component,
    __metadata("design:paramtypes", [])
], ShuffleBag);
exports.ShuffleBag = ShuffleBag;
//# sourceMappingURL=shuffle-bag.js.map