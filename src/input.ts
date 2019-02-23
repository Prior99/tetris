import { component, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "./config";
import { GameState } from "game";

@component
export class Input {
    @inject private gameState: GameState;
    @inject private config: Config;

    public moveLeftTimeout?: number;
    public moveRightTimeout?: number;
    public moveDownTimeout?: number;
    public rotateTimeout?: number;

    public enable() {
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener("keydown", this.handleKeyDown);
    }

    public disable() {
        window.removeEventListener("keyup", this.handleKeyUp);
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    @bind private handleKeyUp(evt: KeyboardEvent) {
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

    @bind private handleKeyDown(evt: KeyboardEvent) {
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
}
