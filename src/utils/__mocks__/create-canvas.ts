import { createCanvas as createNodeCanvas } from "canvas";

export function createCanvas() {
    return createNodeCanvas(800, 600);
}
