import * as React from "react";
import * as ReactDOM from "react-dom";
import DevTools from "mobx-react-devtools";
import { TSDI } from "tsdi";
import { GameCanvas } from "./game-canvas";
import "./index.scss";
import { FactoryAudioContext } from "./factory-audio-context";
import { SpriteManager } from "./sprite-manager";
import { AudioManager } from "./audio-manager";
import { Info } from "./info";
import { Loader } from "./loader";
import { Router } from "./router";

async function main() {
    // Setup dependency injection.
    const tsdi = new TSDI();
    tsdi.enableComponentScanner();
    await tsdi.get(FactoryAudioContext).initialize();

    // Start React.
    ReactDOM.render(
        <>
            <DevTools />
            <Router />
        </>,
        document.getElementById("root"),
    );
}

main();
