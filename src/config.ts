import { component } from "tsdi";
import { vec2 } from "utils";

@component
export class Config {
    public logicalSize = vec2(10, 24);
    public visibleSize = vec2(10, 20);
    public tickSpeed = 1 / 60;
    public networkSpeed = 10 / 60;
    public initialInputTimeout = 10 / 60;
    public inputRepeatTimeout = 1.5 / 60;
    public inputRotateRepeatTimeout = 10 / 60;
    public tetriminoPixelSize = 32;
    public loadStride = 2;
    public garbageTimeout = 4;

    public get visibleRatio() {
        return this.visibleSize.x / this.visibleSize.y;
    }

    public firebaseConfig = {
        apiKey: "AIzaSyA2--0iNx2_fiFEB3WBQkK6oSvizGE7tBI",
        authDomain: "fretris.firebaseapp.com",
        databaseURL: "https://fretris.firebaseio.com",
        projectId: "fretris",
        storageBucket: "",
        messagingSenderId: "822732820309",
    };
}
