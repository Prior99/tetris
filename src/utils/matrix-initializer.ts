import { CellColor } from "types";

export function matrixInitializer(cellColor: CellColor, initialization: (1 | 0)[]) {
    return initialization.map(notEmpty => notEmpty === 1 ? cellColor : CellColor.EMPTY);
}
