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
const lodash_decorators_1 = require("lodash-decorators");
const config_1 = require("./config");
const game_1 = require("game");
let Input = class Input {
    enable() {
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener("keydown", this.handleKeyDown);
    }
    disable() {
        window.removeEventListener("keyup", this.handleKeyUp);
        window.removeEventListener("keydown", this.handleKeyDown);
    }
    handleKeyUp(evt) {
        switch (evt.key) {
            case "ArrowUp":
            case "w": {
                if (this.rotateTimeout) {
                    clearTimeout(this.rotateTimeout);
                    this.rotateTimeout = undefined;
                }
                break;
            }
            case "ArrowLeft":
            case "a": {
                if (this.moveLeftTimeout) {
                    clearTimeout(this.moveLeftTimeout);
                    this.moveLeftTimeout = undefined;
                }
                break;
            }
            case "ArrowRight":
            case "d": {
                if (this.moveRightTimeout) {
                    clearTimeout(this.moveRightTimeout);
                    this.moveRightTimeout = undefined;
                }
                break;
            }
            case "ArrowDown":
            case "s": {
                if (this.moveDownTimeout) {
                    clearTimeout(this.moveDownTimeout);
                    this.moveDownTimeout = undefined;
                }
                break;
            }
        }
    }
    handleKeyDown(evt) {
        switch (evt.key) {
            case "ArrowUp":
            case "w": {
                if (!this.rotateTimeout) {
                    this.gameState.inputRotateRight();
                    const repeat = () => {
                        this.gameState.inputRotateRight();
                        this.rotateTimeout = setTimeout(repeat, this.config.inputRotateRepeatTimeout * 1000);
                    };
                    this.rotateTimeout = setTimeout(repeat, this.config.initialInputTimeout * 1000);
                }
                break;
            }
            case "ArrowLeft":
            case "a": {
                if (!this.moveLeftTimeout) {
                    this.gameState.inputMoveLeft();
                    const repeat = () => {
                        this.gameState.inputMoveLeft();
                        this.moveLeftTimeout = setTimeout(repeat, this.config.inputRepeatTimeout * 1000);
                    };
                    this.moveLeftTimeout = setTimeout(repeat, this.config.initialInputTimeout * 1000);
                }
                break;
            }
            case "ArrowRight":
            case "d": {
                if (!this.moveRightTimeout) {
                    this.gameState.inputMoveRight();
                    const repeat = () => {
                        this.gameState.inputMoveRight();
                        this.moveRightTimeout = setTimeout(repeat, this.config.inputRepeatTimeout * 1000);
                    };
                    this.moveRightTimeout = setTimeout(repeat, this.config.initialInputTimeout * 1000);
                }
                break;
            }
            case "ArrowDown":
            case "s": {
                if (!this.moveDownTimeout) {
                    this.gameState.inputMoveDown();
                    const repeat = () => {
                        this.gameState.inputMoveDown();
                        this.moveDownTimeout = setTimeout(repeat, this.config.inputRepeatTimeout * 1000);
                    };
                    this.moveDownTimeout = setTimeout(repeat, this.config.initialInputTimeout * 1000);
                }
                break;
            }
            case " ": {
                this.gameState.inputHardDrop();
                break;
            }
            case "p": {
                this.gameState.debug = !this.gameState.debug;
                break;
            }
        }
    }
};
__decorate([
    tsdi_1.inject,
    __metadata("design:type", game_1.GameState)
], Input.prototype, "gameState", void 0);
__decorate([
    tsdi_1.inject,
    __metadata("design:type", config_1.Config)
], Input.prototype, "config", void 0);
__decorate([
    lodash_decorators_1.bind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], Input.prototype, "handleKeyUp", null);
__decorate([
    lodash_decorators_1.bind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [KeyboardEvent]),
    __metadata("design:returntype", void 0)
], Input.prototype, "handleKeyDown", null);
Input = __decorate([
    tsdi_1.component
], Input);
exports.Input = Input;
//# sourceMappingURL=input.js.map