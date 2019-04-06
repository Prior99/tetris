import * as React from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from "recharts";
import { bind } from "lodash-decorators";
import { Interval, formatSeconds, chartColors } from "utils";

@observer
export class ChartScoreTimeCumulative extends React.Component<{ intervals: Interval[] }> {
    @bind private xAxisTickFormatter(index: number) {
        const interval = this.props.intervals[index];
        return formatSeconds(interval.start);
    }

    @computed public get data() {
        let score = 0;
        return this.props.intervals.map(({ start, score: current }) => {
            score += current;
            return { start, score };
        });
    }

    public render() {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={this.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis tickFormatter={this.xAxisTickFormatter}/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="1 3"/>
                    <Tooltip/>
                    <Legend />
                    <Area type="monotone" dataKey="score" stroke={chartColors[0]} fill={chartColors[0]} />
                </AreaChart>
            </ResponsiveContainer>

        );
    }
}
