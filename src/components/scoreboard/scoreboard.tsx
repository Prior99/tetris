import { external, inject } from "tsdi";
import * as React from "react";
import { observer } from "mobx-react";
import { Networking } from "networking";
import { Segment, Table } from "semantic-ui-react";

@external @observer
export class Scoreboard extends React.Component {
    @inject private networking: Networking;
    public render() {
        return (
            <Segment>
                <h1>Scoreboard</h1>
                <Table basic="very">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>#</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Won</Table.HeaderCell>
                            <Table.HeaderCell>Score</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    {
                        this.networking.scoreboard.map(({ userId, wins }, index) => {
                            const { score } = this.networking.stateForUser(userId)!;
                            const { name } = this.networking.userById(userId)!;
                            return (
                                <Table.Row key={userId}>
                                    <Table.Cell>{index + 1}</Table.Cell>
                                    <Table.Cell>{wins}</Table.Cell>
                                    <Table.Cell>{name}</Table.Cell>
                                    <Table.Cell>{score}</Table.Cell>
                                </Table.Row>
                            );
                        })
                    }
                    </Table.Body>
                </Table>
            </Segment>
        );
    }
}
