import * as React from "react";
import * as ReactDOM from "react-dom";
import { TSDI } from "tsdi";
import { FactoryAudioContext } from "factories";
import { App } from "components";
import "./index.scss";
import "semantic-ui-css/semantic.min.css";

async function main() {
    // Setup dependency injection.
    const tsdi = new TSDI();
    tsdi.enableComponentScanner();
    await tsdi.get(FactoryAudioContext).initialize();

    // Start React.
    ReactDOM.render(<App />, document.getElementById("root"));
}

main();
