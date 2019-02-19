import { component, initialize } from "tsdi";
import { bind } from "lodash-decorators";

@component
export class Input {
    public moveLeft = false;
    public moveRight = false;
    public rotate = false;

    @initialize protected initialize() {
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener("keydown", this.handleKeyDown);
    }

    @bind private handleKeyUp(evt: KeyboardEvent) {
        switch (evt.key) {
            case "ArrowUp":
            case "w":
                this.rotate = false;
                break;
            case "ArrowLeft":
            case "a":
                this.moveLeft = false;
                break;
            case "ArrowRight":
            case "d":
                this.moveRight = false;
                break;
        }
    }

    @bind private handleKeyDown(evt: KeyboardEvent) {
        switch (evt.key) {
            case "ArrowUp":
            case "w":
                this.rotate = true;
                break;
            case "ArrowLeft":
            case "a":
                this.moveLeft = true;
                break;
            case "ArrowRight":
            case "d":
                this.moveRight = true;
                break;
        }
    }
}
