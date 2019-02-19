import * as React from "react";
import * as ReactDOM from "react-dom";
import DevTools from "mobx-react-devtools";
import { TSDI } from "tsdi";
import "./factories";
import "./global.scss";
import "leaflet/dist/leaflet.css";

// Setup dependency injection.
const tsdi = new TSDI();
tsdi.enableComponentScanner();

// Start React.
ReactDOM.render(
    <div>
        <DevTools />
    </div>,
    document.getElementById("root"),
);
