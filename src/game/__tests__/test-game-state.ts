import { GameParameters, GameOverReason, WinningConditionType } from "types";
import { createParameters } from "test-utils";
import { GameState } from "../game-state";
import { ShuffleBag } from "../shuffle-bag";
import { Playfield } from "../playfield";
import { Effects } from "../effects";
import { Statistics } from "../statistics";

describe("GameState", () => {
    let shuffleBag: ShuffleBag;
    let playfield: Playfield;
    let effects: Effects;
    let parameters: GameParameters;
    let gameState: GameState;

    beforeEach(() => {
        parameters = createParameters();
        parameters.winningCondition = { condition: WinningConditionType.CLEAR_GARBAGE };
        playfield = new Playfield(parameters);
        shuffleBag = new ShuffleBag(playfield, parameters.seed);
        effects = new Effects();
        gameState = new GameState(shuffleBag, playfield, effects, parameters, new Statistics());
    });

    describe("initially", () => {
        it("shows the expected temporary state", () => expect(gameState.temporaryState.toString()).toMatchSnapshot());
    });

    describe("after 2s", () => {
        beforeEach(() => gameState.tick(2));

        it("shows the expected temporary state", () => expect(gameState.temporaryState.toString()).toMatchSnapshot());
    });

    describe("after topping out", () => {
        beforeEach(() => {
            for (let i = 0; i < 9; ++i) { gameState.inputHardDrop(); }
        });

        it("shows the expected temporary state", () => expect(gameState.temporaryState.toString()).toMatchSnapshot());

        it("sets game over reason", () => expect(gameState.gameOverReason).toBe(GameOverReason.TOPPED_OUT));
    });

    describe("dropping first tetrimino", () => {
        beforeEach(() => {
            gameState.inputMoveLeft();
            gameState.inputMoveLeft();
            gameState.inputHardDrop();
        });

        it("shows the expected temporary state", () => expect(gameState.temporaryState.toString()).toMatchSnapshot());

        describe("holding second tetrimino", () => {
            beforeEach(() => gameState.inputHoldPiece());

            it("shows the expected temporary state", () => {
                expect(gameState.temporaryState.toString()).toMatchSnapshot();
            });

            describe("rotating and dropping third tetrimino", () => {
                beforeEach(() => {
                    gameState.inputRotateRight();
                    gameState.inputRotateRight();
                    gameState.inputMoveRight();
                    gameState.inputHardDrop();
                });

                it("shows the expected temporary state", () => {
                    expect(gameState.temporaryState.toString()).toMatchSnapshot();
                });

                it("reports the cleared line", () => expect(gameState.lines).toBe(1));

                it("reports the score", () => expect(gameState.score).toBe(36));

                describe("dropping fourth tetrimino", () => {
                    beforeEach(() => gameState.inputHardDrop());

                    it("shows the expected temporary state", () => {
                        expect(gameState.temporaryState.toString()).toMatchSnapshot();
                    });

                    it("reports the cleared line", () => expect(gameState.lines).toBe(2));

                    it("reports the score", () => expect(gameState.score).toBe(76));

                    it("reports the correct game over reason", () => {
                        expect(gameState.gameOverReason).toBe(GameOverReason.GARBAGE_CLEARED);
                    });

                    it("sets combo count to two", () => expect(gameState.comboCount).toBe(2));
                });
            });
        });
    });
});
