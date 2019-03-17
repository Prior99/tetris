import { external, inject } from "tsdi";
import { equals } from "ramda";
import { observable, computed } from "mobx";
import { GameOverReason, RemoteGameState, GameParameters, GameMode, GarbageMode, WinningConditionType } from "types";
import { Matrix, randomSeed } from "utils";
import { Config } from "config";
import { RemoteUsers } from "./remote-users";

@external
export class NetworkGame {
    @inject private config: Config;

    @observable private states = new Map<string, RemoteGameState>();
    @observable public parameters: GameParameters = {
        seed: randomSeed(),
        garbageMode: GarbageMode.HALF_REFERRED,
        gameMode: GameMode.SINGLE_PLAYER,
        initialGarbageLines: 0,
        initialLevel: 0,
        levelUpDisabled: false,
        winningCondition: { condition: WinningConditionType.HIGHEST_SCORE_ONE_GAME },
    };
    @observable private scoreboardMap = new Map<string, Set<string>>();

    constructor(private users: RemoteUsers) {}

    private playfields = new Map<string, Matrix>();

    public initialize() {
        this.users.all.forEach(user => {
            this.playfields.set(user.id, new Matrix(this.config.logicalSize));
            this.states.set(user.id, {
                score: 0,
                lines: 0,
                level: 0,
                gameOverReason: GameOverReason.NONE,
                timeGameOver: undefined,
            });
            this.scoreboardMap.set(user.id, new Set());
        });
    }

    @computed public get allStates() {
        return Array.from(this.states.values());
    }

    @computed public get all() {
        return Array.from(this.playfields.values());
    }

    public update(userId: string, matrix: Matrix, state: RemoteGameState) {
        if (!this.playfields.has(userId)) {
            this.playfields.set(userId, matrix);
        }
        else if (!matrix.equals(this.playfields.get(userId)!)) {
            this.playfields.get(userId)!.update(matrix);
        }
        if (!equals(this.states.get(userId), state)) {
            this.states.set(userId, state);
        }
        if (this.allGameOver) {
            if (this.currentWinners) {
                this.currentWinners.forEach(winnerId => {
                    if (!this.scoreboardMap.has(winnerId)) { throw new Error("An unknown user has won the game."); }
                    this.scoreboardMap.get(winnerId)!.add(this.parameters.seed);
                });
            }
        }
    }

    public get currentWinners(): string[] | undefined {
        if (this.allStates.some(({ gameOverReason }) => gameOverReason === GameOverReason.NONE)) {
            return;
        }
        switch (this.parameters.winningCondition.condition) {
            case WinningConditionType.BATTLE_ROYALE: {
                return Array.from(this.states.entries())
                    .filter(([_, { gameOverReason }]) => gameOverReason === GameOverReason.LAST_MAN_STANDING)
                    .map(([userId, _]) => userId);
            }
            case WinningConditionType.CLEAR_GARBAGE: {
                return Array.from(this.states.entries())
                    .filter(([_, { gameOverReason }]) => gameOverReason === GameOverReason.GARBAGE_CLEARED)
                    .map(([userId, _]) => userId);
            }
            case WinningConditionType.HIGHEST_SCORE_ONE_GAME:
            case WinningConditionType.SUM_IN_TIME: {
                let highestScore: number | undefined;
                let highestUserIds: string[] = [];
                for (let [userId, state] of this.states.entries()) {
                    if (highestScore === undefined || state.score > highestScore) {
                        highestScore = state.score;
                        highestUserIds = [userId];
                    }
                    else if (state.score === highestScore) {
                        highestUserIds.push(userId);
                    }
                }
                return highestUserIds;
            }
        }
    }

    public playfieldForUser(userId: string) {
        return this.playfields.get(userId);
    }

    public stateForUser(userId: string) {
        return this.states.get(userId);
    }

    @computed public get allGameOver() {
        return this.allStates.every(({ gameOverReason }) => gameOverReason !== GameOverReason.NONE);
    }

    @computed public get otherAliveUsers() {
        if (!this.users.own) { throw new Error("Users wasn't initialized when retrieving alive users."); }
        return this.users.all
            .filter(user => user.id !== this.users.own!.id)
            .filter(user => this.stateForUser(user.id)!.gameOverReason === GameOverReason.NONE);
    }

    public get randomOtherAliveUser() {
        const { otherAliveUsers } = this;
        if (otherAliveUsers.length === 0) { return; }
        return otherAliveUsers[Math.floor(Math.random() * otherAliveUsers.length)];
    }

    public get scoreboard() {
        return Array.from(this.scoreboardMap.entries())
            .map(([userId, wins]) => ({
                userId,
                wins: wins.size,
            }))
            .sort((a, b) => b.wins - a.wins);
    }
}
