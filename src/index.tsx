import * as React from "react";
import * as ReactDOM from "react-dom";
import DevTools from "mobx-react-devtools";
import { TSDI } from "tsdi";
import { FactoryAudioContext } from "factory-audio-context";
import { Router } from "components";
import "./index.scss";

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
