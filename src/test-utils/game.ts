import { merge } from "ramda";
import { GameMode, Mutable, WinningConditionType, GarbageMode } from "types";
import { vec2 } from "utils";
import { Game } from "game";
import { mockPlayfield } from "./playfield";

export function mockGame(override?: Partial<Game>): Mutable<Game> {
    const defaults: Game = {
        running: true,
        serial: "random string",
        seconds: 10,
        tetriminoPreviews: [],
        level: 1,
        lines: 0,
        score: 0,
        gameOver: false,
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
        parameters:{
            winningCondition: {
                condition: WinningConditionType.CLEAR_GARBAGE,
            },
            gameMode: GameMode.SINGLE_PLAYER,
            seed: "some-seed",
            initialGarbageLines: 10,
            garbageMode: GarbageMode.NONE,
            initialLevel: 0,
            levelUpDisabled: false,
        }
    } as any;
    return merge(defaults, override ?? {}) as any as Mutable<Game>;
}
