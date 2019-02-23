"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cell_color_1 = require("../cell-color");
function matrixInitializer(cellColor, initialization) {
    return initialization.map(notEmpty => notEmpty === 1 ? cellColor : cell_color_1.CellColor.EMPTY);
}
exports.matrixInitializer = matrixInitializer;
//# sourceMappingURL=matrix-initializer.js.map