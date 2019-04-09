import { component, initialize, inject } from "tsdi";
import { observable } from "mobx";
import { initializeApp, database } from "firebase/app";
import "firebase/database";
import * as Uuid from "uuid";
import { Config } from "config";
import { Interval, SerializedInterval } from "utils";

export interface LeaderboardEntry {
    name: string;
    score: number;
    statisticsId?: string;
}

@component
export class Leaderboard {
    @inject private config: Config;

    @observable public scores: LeaderboardEntry[] = [];
    @observable public statistics = new Map<string, Interval[]>();
    @observable public loading = true;

    @initialize protected async initialize() {
        initializeApp(this.config.firebaseConfig);
        await this.refresh();
        this.loading = false;
    }

    public async refresh() {
        const result = await database()
            .ref("/scores/global/scores")
            .orderByChild("score")
            .limitToLast(100)
            .once("value");
        const scores: LeaderboardEntry[] = Object.values(result.toJSON() as any);
        this.scores = scores.sort((a, b) => b.score - a.score);
        return scores;
    }

    private async loadStatistics(id: string): Promise<void> {
        const result = await database()
            .ref(`/statistics/global/${id}`)
            .once("value");
        const intervals = Object.values(result.toJSON() as SerializedInterval[])
            .map(interval => new Interval(interval));
        this.statistics.set(id, intervals);
    }

    private async submitStatistics(id: string, statistics: Interval[]) {
        await database().ref(`/statistics/global/${id}`).set(statistics.map(interval => interval.serialized));
    }

    public getStatistics(id: string): Interval[] | undefined {
        if (this.statistics.has(id)) {
            return this.statistics.get(id)!;
        }
        this.loadStatistics(id);
    }

    public async submitScore(name: string, score: number, statistics: Interval[]) {
        const statisticsId = Uuid.v4();
        await database().ref("/scores/global/scores").push({ score, name, statisticsId });
        await this.submitStatistics(statisticsId, statistics);
        await this.refresh();
    }
}
