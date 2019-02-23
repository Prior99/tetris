"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const mobx_react_devtools_1 = require("mobx-react-devtools");
const tsdi_1 = require("tsdi");
const factory_audio_context_1 = require("factory-audio-context");
const components_1 = require("components");
require("./index.scss");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Setup dependency injection.
        const tsdi = new tsdi_1.TSDI();
        tsdi.enableComponentScanner();
        yield tsdi.get(factory_audio_context_1.FactoryAudioContext).initialize();
        // Start React.
        ReactDOM.render(React.createElement(React.Fragment, null,
            React.createElement(mobx_react_devtools_1.default, null),
            React.createElement(components_1.Router, null)), document.getElementById("root"));
    });
}
main();
//# sourceMappingURL=index.js.map