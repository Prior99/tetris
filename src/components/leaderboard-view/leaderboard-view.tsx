import { external, inject, initialize } from "tsdi";
import * as React from "react";
import { observer } from "mobx-react";
import { History } from "history";
import { Leaderboard } from "leaderboard";
import { bind } from "lodash-decorators";
import * as css from "./leaderboard-view.scss";
import { MenuContainer } from "components/menu-container";
import { Segment, Table, Button } from "semantic-ui-react";

@external @observer
export class LeaderboardView extends React.Component {
    @inject private leaderboard: Leaderboard;
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

    private renderTable(start: number, end: number) {
        return (
            <Table compact basic="very">
                <Table.Header>
                    <Table.HeaderCell className={css.rank}>#</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Score</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    {
                        this.leaderboard.scores.slice(start - 1, end).map(({ name, score }, index) => (
                            <Table.Row key={index}>
                                <Table.Cell className={css.cell}>{index + start}</Table.Cell>
                                <Table.Cell className={css.cell}>{name}</Table.Cell>
                                <Table.Cell className={css.cell}>{score}</Table.Cell>
                            </Table.Row>
                        ))
                    }
                </Table.Body>
            </Table>
        );
    }

    public render() {
        return (
            <MenuContainer>
                <Segment loading={this.leaderboard.loading}>
                    <h1>Leaderboard</h1>
                    <div className={css.content}>
                        {this.renderTable(1, 15)}
                        {this.renderTable(16, 30)}
                        {this.renderTable(31, 45)}
                    </div>
                    <Button primary onClick={this.handleBack}>Back</Button>
                </Segment>
            </MenuContainer>
        );
    }
}
