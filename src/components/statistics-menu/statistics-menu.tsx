import * as React from "react";
import { Interval } from "utils";
import { Tab } from "semantic-ui-react";
import { bind } from "lodash-decorators";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";
import { ChartScoreTime } from "../chart-score-time";
import { ChartScoreTimeCumulative } from "../chart-score-time-cumulative";
import { ChartDistributionTime } from "../chart-distribution-time";
import { ChartSpeedTime } from "../chart-speed-time";
import { ChartDistribution } from "../chart-distribution";

@observer
export class StatisticsMenu extends React.Component<{ intervals: Interval[] }> {
    @observable private activeTab = 0;

    @computed public get overall() {
        return Interval.combine(...this.props.intervals);
    }

    public get panes() {
        return [
            { menuItem: "Score / Time (Cumulative)" },
            { menuItem: "Score / Time" },
            { menuItem: "Distribution / Time" },
            { menuItem: "Distribution" },
            { menuItem: "Speed / Time" },
        ];
    }

    @bind private handleTabChange(_, { activeIndex }: { activeIndex: number }) {
        this.activeTab = activeIndex;
    }

    private renderTab() {
        switch (this.activeTab) {
            case 0: return <ChartScoreTimeCumulative intervals={this.props.intervals} />;
            case 1: return <ChartScoreTime intervals={this.props.intervals} />;
            case 2: return <ChartDistributionTime intervals={this.props.intervals} />;
            case 3: return <ChartDistribution overall={this.overall} />;
            case 4: return <ChartSpeedTime intervals={this.props.intervals} />;
            default: return <></>;
        }
    }

    public render() {
        return (
            <>
                <Tab
                    panes={this.panes}
                    activeIndex={this.activeTab}
                    onTabChange={this.handleTabChange}
                />
                {this.renderTab()}
            </>
        );
    }
}