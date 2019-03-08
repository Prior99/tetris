import { createCanvas, Canvas } from "canvas";
import { vec2, Matrix, matrixInitializer } from "utils";
import { GameMode } from "types";
import { GraphicsGame } from "..";

const mockGame = {
    gameMode: GameMode.SINGLE_PLAYER,
    running: true,
    serial: "random string",
    seconds: 10,
    tetriminoPreviews: [],
    level: 1,
    lines: 0,
    score: 0,
    toppedOut: false,
    tetriminoOffset: vec2(4, 4),
    lastLockPosition: vec2(5, 5),
    hasHit: false,
    timeSinceLastLock: undefined,
    timeSinceLastHit: undefined,
    timeSinceLastDouble: 0.3,
    timeSinceLastTriple: undefined,
    timeSinceLastTetris: undefined,
    timeSinceComboStart: undefined,
    timeSinceComboEnd: undefined,
    timeout: undefined,
    comboCounts: [],
    temporaryState: new Matrix(vec2(10, 30), [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        9, 9, 9, 9, 9, 9, 9, 9, 9 ,9,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 8, 8, 0,
        0, 0, 0, 0, 0, 0, 0, 8, 8, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 5, 5, 0,
        0, 0, 0, 0, 0, 0, 5, 5, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 1, 0, 4, 4, 0, 0, 0, 0,
        1, 1, 1, 0, 4, 4, 0, 0, 0, 0,
    ]),
    effects: [],
    restart: jest.fn(),
    addIncomingGarbage: jest.fn(),
    hasOutgoingGarbage: false,
    outgoingGarbage: [],
    clearOutgoingGarbage: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    tick: jest.fn(),
    incomingGarbage: [],
    holdPiece: undefined,
    latestIncomingGarbage: undefined,
};

describe("GraphicsGame", () => {
    let graphics: GraphicsGame;
    let canvas: Canvas;

    beforeEach(() => {
        canvas = createCanvas(320, 640);
        graphics = new GraphicsGame(mockGame as any);
        graphics.rescale(vec2(320, 640));
        graphics.updateCanvas(canvas);
        graphics.render();
    });

    it("matches the screenshot", () => expect(canvas.toBuffer("image/png")).toMatchImageSnapshot());
});
