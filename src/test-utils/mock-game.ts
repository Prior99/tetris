import { merge } from "ramda";
import { GameMode } from "types";
import { vec2 } from "utils";
import { Game } from "game";
import { mockPlayfield } from "./mock-playfield";

export function mockGame(override?: Partial<Game>): Game {
    return merge({
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
        temporaryState: mockPlayfield(),
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
    }, override) as any as Game;
}
