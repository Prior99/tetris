import { external, inject } from "tsdi";
import * as React from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { History } from "history";
import { Leaderboard } from "leaderboard";
import { bind } from "lodash-decorators";
import { MenuContainer } from "components/menu-container";
import { Segment, Button } from "semantic-ui-react";
import { Statistics } from "../statistics";

interface LeaderboardStatisticsViewProps {
    readonly match: {
        readonly params: {
            readonly id: string;
        };
    };
}

@external @observer
export class LeaderboardStatisticsView extends React.Component<LeaderboardStatisticsViewProps> {
    @inject private leaderboard: Leaderboard;
    @inject("History") private history: History;

    @bind private handleBack() {
        this.history.goBack();
    }

    @computed private get currentStatistics() {
        return this.leaderboard.getStatistics(this.props.match.params.id);
    }

    public render() {
        return (
            <MenuContainer>
                <Segment loading={this.currentStatistics === undefined}>
                    <h1>Statistics</h1>
                    <Statistics intervals={this.currentStatistics || []} />
                    <Button primary onClick={this.handleBack}>Back</Button>
                </Segment>
            </MenuContainer>
        );
    }
}
