import { component, initialize, inject } from "tsdi";
import { observable } from "mobx";
import { Config } from "config";
import { initializeApp, database } from "firebase";

export interface LeaderboardEntry {
    name: string;
    score: number;
}

@component
export class Leaderboard {
    @inject private config: Config;

    @observable public scores: LeaderboardEntry[] = [];

    @initialize protected async initialize() {
        initializeApp(this.config.firebaseConfig);
        await this.refresh();
    }

    public async refresh() {
        const result = await database()
            .ref("/scores/global/scores")
            .orderByChild("score")
            .limitToLast(25)
            .once("value");
        const scores: LeaderboardEntry[] = Object.values(result.toJSON() as any);
        this.scores = scores.sort((a, b) => b.score - a.score);
        return scores;

    }

    public async submitScore(name: string, score: number) {
        await database().ref("/scores/global/scores").push({ score, name });
        await this.refresh();
    }
}
