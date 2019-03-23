import { external, inject, initialize } from "tsdi";
import * as React from "react";
import { observer } from "mobx-react";
import { History } from "history";
import { Leaderboard } from "leaderboard";
import { UI } from "ui";
import { bind } from "lodash-decorators";
import * as css from "./leaderboard-view.scss";

@external @observer
export class LeaderboardView extends React.Component {
    @inject private leaderboard: Leaderboard;
    @inject private ui: UI;
    @inject("History") private history: History;

    private interval: any;

    @initialize protected initialize() {
        this.interval = setInterval(() => this.refreshLeadboard(), 10000);
        this.refreshLeadboard();
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    private refreshLeadboard() {
        this.leaderboard.refresh();
    }

    @bind private handleBack() {
        this.history.push("/main-menu");
    }

    public render() {
        return (
            <section className={css.leaderboard}>
                <div className={css.wrapper}>
                    <h1>Leaderboard</h1>
                    <div className={css.content}>
                        <ol>
                            {
                                this.leaderboard.scores.map(({ name, score }) => (
                                    <li><span className={css.score}>{score}</span> {name}</li>
                                ))
                            }
                        </ol>
                        <a onClick={this.handleBack}>Back</a>
                    </div>
                </div>
            </section>
        );
    }
}
