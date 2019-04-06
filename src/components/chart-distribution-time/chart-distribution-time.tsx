import * as React from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from "recharts";
import { bind } from "lodash-decorators";
import { Interval, formatSeconds, chartColors } from "utils";

@observer
export class ChartDistributionTime extends React.Component<{ intervals: Interval[] }> {
    @bind private xAxisTickFormatter(index: number) {
        const interval = this.props.intervals[index];
        return formatSeconds(interval.start);
    }

    @computed public get data() {
        return this.props.intervals.map(({ start, lineDistribution }) => ({
            start,
            tetris: lineDistribution.get(4),
            triple: lineDistribution.get(3),
            double: lineDistribution.get(2),
            single: lineDistribution.get(1),
         }));
    }

    public render() {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={this.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis tickFormatter={this.xAxisTickFormatter}/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="1 3"/>
                    <Tooltip/>
                    <Legend />
                    <Bar dataKey="single" stackId="score" fill={chartColors[2]} />
                    <Bar dataKey="double" stackId="score" fill={chartColors[1]} />
                    <Bar dataKey="triple" stackId="score" fill={chartColors[3]} />
                    <Bar dataKey="tetris" stackId="score" fill={chartColors[0]} />
                </BarChart>
            </ResponsiveContainer>

        );
    }
}
