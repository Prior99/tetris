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
const React = require("react");
const tsdi_1 = require("tsdi");
const game_1 = require("game");
const mobx_react_1 = require("mobx-react");
let Info = class Info extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("p", null,
                "Score: ",
                this.gameState.score),
            React.createElement("p", null,
                "Line: ",
                this.gameState.lines),
            React.createElement("p", null,
                "Level: ",
                this.gameState.level)));
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", game_1.GameState)
], Info.prototype, "gameState", void 0);
Info = __decorate([
    tsdi_1.external, mobx_react_1.observer
], Info);
exports.Info = Info;
//# sourceMappingURL=info.js.map