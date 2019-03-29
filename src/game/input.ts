import { external, inject } from "tsdi";
import { bind } from "lodash-decorators";
import { Config } from "config";
import { GameState } from "./game-state";

interface KeyState {
    timePressed: number;
    initialFired: boolean;
    nextRepeat: number;
}

@external
export class Input {
    @inject private config: Config;

    public moveLeft?: KeyState;
    public moveRight?: KeyState;
    public moveDown?: KeyState;
    public rotateRight?: KeyState;
    public rotateLeft?: KeyState;
    public hardDrop?: KeyState;

    private timeCurrent = 0;

    constructor(private gameState: GameState) {
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener("keydown", this.handleKeyDown);
    }

    private keyState(timePressed: number) {
        return {
            timePressed,
            initialFired: false,
            nextRepeat: timePressed + this.config.initialInputTimeout,
        };
    }

    public disable() {
        window.removeEventListener("keyup", this.handleKeyUp);
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    private handleOnceInput(callback: () => void, state?: KeyState) {
        if (!state) { return; }
        if (!state.initialFired) {
            state.initialFired = true;
            callback();
        }
    }

    private handleInput(callback: () => void, state?: KeyState, repeatTimeout = this.config.inputRepeatTimeout) {
        if (!state) { return; }
        if (!state.initialFired) {
            state.initialFired = true;
            callback();
            return;
        }
        if (this.timeCurrent >= state.nextRepeat) {
            state.nextRepeat += repeatTimeout;
            callback();
        }
    }

    public tick(time: number) {
        this.timeCurrent = time;
        this.handleOnceInput(this.gameState.inputRotateRight, this.rotateRight);
        this.handleOnceInput(this.gameState.inputRotateLeft, this.rotateLeft);
        this.handleOnceInput(this.gameState.inputHardDrop, this.hardDrop);
        this.handleInput(this.gameState.inputMoveLeft, this.moveLeft);
        this.handleInput(this.gameState.inputMoveRight, this.moveRight);
        this.handleInput(this.gameState.inputMoveDown, this.moveDown);
    }

    @bind private handleKeyUp(evt: KeyboardEvent) {
        switch (evt.key) {
            case "ArrowUp":
            case "x":
            case "w": {
                this.rotateRight = undefined;
                break;
            }
            case "ArrowLeft":
            case "a": {
                this.moveLeft = undefined;
                break;
            }
            case "ArrowRight":
            case "d": {
                this.moveRight = undefined;
                break;
            }
            case "ArrowDown":
            case "s": {
                this.moveDown = undefined;
                break;
            }
            case " ": {
                this.hardDrop = undefined;
                break;
            }
        }
    }

    @bind private handleKeyDown(evt: KeyboardEvent) {
        switch (evt.key) {
            case "ArrowUp":
            case "x":
            case "w": {
                if (!this.rotateRight) {
                    this.rotateRight = this.keyState(this.timeCurrent);
                }
                break;
            }
            case "ArrowLeft":
            case "a": {
                if (!this.moveLeft) {
                    this.moveLeft = this.keyState(this.timeCurrent);
                }
                break;
            }
            case "ArrowRight":
            case "d": {
                if (!this.moveRight) {
                    this.moveRight = this.keyState(this.timeCurrent);
                }
                break;
            }
            case "ArrowDown":
            case "s": {
                if (!this.moveDown) {
                    this.moveDown = this.keyState(this.timeCurrent);
                }
                break;
            }
            case " ": {
                if (evt.target === document.body) { evt.preventDefault(); }
                if (!this.hardDrop) {
                    this.hardDrop = this.keyState(this.timeCurrent);
                }
                break;
            }
            case "Shift":
            case "c": {
                this.gameState.inputHoldPiece();
            }
        }
    }
}
