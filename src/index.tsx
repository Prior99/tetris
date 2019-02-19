import * as React from "react";
import * as ReactDOM from "react-dom";
import DevTools from "mobx-react-devtools";
import { TSDI } from "tsdi";
import { GameCanvas } from "./game-canvas";
import "./index.scss";

// Setup dependency injection.
const tsdi = new TSDI();
tsdi.enableComponentScanner();

// Start React.
ReactDOM.render(
    <>
        <DevTools />
        <GameCanvas />
    </>,
    document.getElementById("root"),
);
