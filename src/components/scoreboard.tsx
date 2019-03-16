import { external, inject } from "tsdi";
import * as React from "react";
import { observer } from "mobx-react";
import { Networking } from "networking";
import * as css from "./scoreboard.scss";

@external @observer
export class Scoreboard extends React.Component {
    @inject private networking: Networking;
    public render() {
        return (
            <section className={css.scoreboard}>
                <div className={css.wrapper}>
                    <h1>Scoreboard</h1>
                    <div className={css.content}>
                        <table className={css.table}>
                            <thead>
                                <tr>
                                    <td className={css.head}>Rank</td>
                                    <td className={css.head}>Won</td>
                                    <td className={css.head}>Name</td>
                                    <td className={css.head}>Score</td>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.networking.winners.map(({ userId, wins }, index) => {
                                    const { score } = this.networking.stateForUser(userId)!;
                                    const { name } = this.networking.userById(userId)!;
                                    return (
                                        <tr key={userId}>
                                            <td className={css.rank}>{index + 1}</td>
                                            <td className={css.wins}>{wins}</td>
                                            <td className={css.name}>{name}</td>
                                            <td className={css.score}>{score}</td>
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        );
    }
}
