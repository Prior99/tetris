import { GameOverReason, WinningConditionType } from "types";
import { Config } from "config";
import { createRemoteUsers, createNetworkGame, updateNetworkGameState } from "test-utils";
import { Matrix } from "utils";
import { NetworkGame } from "../network-game";
import { RemoteUsers } from "../remote-users";

describe("NetworkGame", () => {
    let remoteUsers: RemoteUsers;
    let networkGame: NetworkGame;

    beforeEach(() => {
        remoteUsers = createRemoteUsers();
        networkGame = createNetworkGame(remoteUsers);
        networkGame.initialize();
    });

    describe("initially", () => {
        it("reports winners", () => expect(networkGame.scoreboard).toEqual([
            { userId: "user-id-own", wins: 0 },
            { userId: "user-id-a", wins: 0 },
            { userId: "user-id-b", wins: 0 },
            { userId: "user-id-c", wins: 0 },
        ]));

        it("nobody is game over", () => expect(networkGame.allGameOver).toBe(false));

        it("reports initial states", () => {
            remoteUsers.all.forEach(({ id }) => {
                expect(networkGame.stateForUser(id)).toEqual({
                    score: 0,
                    lines: 0,
                    level: 0,
                    gameOverReason: GameOverReason.NONE,
                    timeGameOver: undefined,
                });
            });
        });

        it("has no winner", () => expect(networkGame.currentWinners).toBeUndefined());

        it("returns all users as alive", () => expect(networkGame.otherAliveUsers).toEqual([
            "user-id-a",
            "user-id-b",
            "user-id-c",
        ]));

        it("reports empty playfields", () => {
            remoteUsers.all.forEach(({ id }) => {
                expect(networkGame.playfieldForUser(id)).toEqual(new Matrix(tsdi.get(Config).logicalSize));
            });
        });
    });

    describe(`with winning condition: ${WinningConditionType.BATTLE_ROYALE}`, () => {
        beforeEach(() => networkGame.parameters.winningCondition = {
            condition: WinningConditionType.BATTLE_ROYALE,
            lives: 1,
        });

        it("has no winner", () => expect(networkGame.currentWinners).toBeUndefined());

        it("nobody is game over", () => expect(networkGame.allGameOver).toBe(false));

        it("doesn't report to be last man standing", () => {
            expect(networkGame.isGameOverLastManStanding).toBe(false);
        });

        describe("with all other users game over", () => {
            beforeEach(() => {
                ["user-id-a", "user-id-b", "user-id-c"].forEach(userId => {
                    updateNetworkGameState(networkGame, userId, { gameOverReason: GameOverReason.TOPPED_OUT });
                });
            });

            it("reports user to be last man standing", () => {
                expect(networkGame.isGameOverLastManStanding).toBe(true);
            });
        });

        describe("with one user being the winner", () => {
            beforeEach(() => {
                ["user-id-a", "user-id-b", "user-id-own"].forEach(userId => {
                    updateNetworkGameState(networkGame, userId, { gameOverReason: GameOverReason.TOPPED_OUT });
                });
                updateNetworkGameState(networkGame, "user-id-c", { gameOverReason: GameOverReason.LAST_MAN_STANDING });
            });

            it("has a winner", () => expect(networkGame.currentWinners).toEqual(["user-id-c"]));

            it("all users are game over", () => expect(networkGame.allGameOver).toBe(true));

            it("reports winners", () => expect(networkGame.scoreboard).toEqual([
                { userId: "user-id-c", wins: 1 },
                { userId: "user-id-own", wins: 0 },
                { userId: "user-id-a", wins: 0 },
                { userId: "user-id-b", wins: 0 },
            ]));
        });
    });

    describe(`with winning condition: ${WinningConditionType.CLEAR_GARBAGE}`, () => {
        beforeEach(() => networkGame.parameters.winningCondition = { condition: WinningConditionType.CLEAR_GARBAGE });

        it("has no winner", () => expect(networkGame.currentWinners).toBeUndefined());

        it("nobody is game over", () => expect(networkGame.allGameOver).toBe(false));

        it("doesn't report other user to have cleared the garbage", () => {
            expect(networkGame.isGameOverOtherUserClearedGarbage).toBe(false);
        });

        describe("with one other user having cleared the garbage", () => {
            beforeEach(() => updateNetworkGameState(networkGame, "user-id-a", {
                gameOverReason: GameOverReason.GARBAGE_CLEARED,
            }));

            it("reports other user to have cleared the garbage", () => {
                expect(networkGame.isGameOverOtherUserClearedGarbage).toBe(true);
            });
        });

        describe("with one user being the winner", () => {
            beforeEach(() => {
                ["user-id-a", "user-id-b", "user-id-own"].forEach(userId => {
                    updateNetworkGameState(networkGame, userId, {
                        gameOverReason: GameOverReason.OTHER_USER_HAS_WON,
                        timeGameOver: 100,
                    });
                });
                updateNetworkGameState(networkGame, "user-id-c", {
                    gameOverReason: GameOverReason.GARBAGE_CLEARED,
                    timeGameOver: 100,
                });
            });

            it("has a winner", () => expect(networkGame.currentWinners).toEqual(["user-id-c"]));

            it("all users are game over", () => expect(networkGame.allGameOver).toBe(true));

            it("reports winners", () => expect(networkGame.scoreboard).toEqual([
                { userId: "user-id-c", wins: 1 },
                { userId: "user-id-own", wins: 0 },
                { userId: "user-id-a", wins: 0 },
                { userId: "user-id-b", wins: 0 },
            ]));
        });
    });

    [WinningConditionType.HIGHEST_SCORE_ONE_GAME, WinningConditionType.SUM_IN_TIME].forEach(condition => {
        describe(`with winning condition: ${condition}`, () => {
            beforeEach(() => {
                switch (condition) {
                    case WinningConditionType.HIGHEST_SCORE_ONE_GAME: {
                        networkGame.parameters.winningCondition = {
                            condition: WinningConditionType.HIGHEST_SCORE_ONE_GAME,
                        };
                    }
                    case WinningConditionType.SUM_IN_TIME: {
                        networkGame.parameters.winningCondition = {
                            condition: WinningConditionType.SUM_IN_TIME,
                            seconds: 500,
                        };
                    }
                }
            });

            it("has no winner", () => expect(networkGame.currentWinners).toBeUndefined());

            it("nobody is game over", () => expect(networkGame.allGameOver).toBe(false));

            describe("with one user being the winner", () => {
                beforeEach(() => {
                    updateNetworkGameState(networkGame, "user-id-c", {
                        gameOverReason: GameOverReason.TOPPED_OUT,
                        timeGameOver: 100,
                    });
                    ["user-id-a", "user-id-b", "user-id-own"].forEach((userId, index) => {
                        updateNetworkGameState(networkGame, userId, {
                            gameOverReason: GameOverReason.TIME_OVER,
                            timeGameOver: 500,
                            score: index * 1000,
                        });
                    });
                });

                it("has a winner", () => expect(networkGame.currentWinners).toEqual(["user-id-own"]));

                it("all users are game over", () => expect(networkGame.allGameOver).toBe(true));

                it("reports winners", () => expect(networkGame.scoreboard).toEqual([
                    { userId: "user-id-own", wins: 1 },
                    { userId: "user-id-a", wins: 0 },
                    { userId: "user-id-b", wins: 0 },
                    { userId: "user-id-c", wins: 0 },
                ]));
            });
        });
    });
});
