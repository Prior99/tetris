import { GameOverReason } from "types";
import { Config } from "config";
import { createRemoteUsers, createNetworkGame } from "test-utils";
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
        it("reports winners", () => expect(networkGame.winnerList).toEqual([
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

        it("has no winner", () => expect(networkGame.winner).toBeUndefined());

        it("returns all users as alive", () => expect(networkGame.otherAliveUsers).toEqual([
            { id: "user-id-a", name: "User A" },
            { id: "user-id-b", name: "User B" },
            { id: "user-id-c", name: "User C" },
        ]));

        it("reports empty playfields", () => {
            remoteUsers.all.forEach(({ id }) => {
                expect(networkGame.playfieldForUser(id)).toEqual(new Matrix(tsdi.get(Config).logicalSize));
            });
        });
    });
});
