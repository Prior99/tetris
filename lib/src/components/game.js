"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const game_canvas_1 = require("./game-canvas");
const info_1 = require("./info");
class Game extends React.Component {
    render() {
        return (React.createElement(React.Fragment, null,
            React.createElement(game_canvas_1.GameCanvas, null),
            React.createElement(info_1.Info, null)));
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map