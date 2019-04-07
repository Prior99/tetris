import * as React from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";
import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts";
import { bind } from "lodash-decorators";
import { Interval, formatSeconds, chartColors } from "utils";

@observer
export class ChartHighestBlockTime extends React.Component<{ intervals: Interval[] }> {
    @bind private xAxisTickFormatter(index: number) {
        const interval = this.props.intervals[index];
        return formatSeconds(interval.start);
    }

    @computed public get data() {
        return this.props.intervals.map(({ start, highestBlock }) => ({ start, height: highestBlock }));
    }

    public render() {
        return (
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={this.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <XAxis tickFormatter={this.xAxisTickFormatter}/>
                    <YAxis/>
                    <CartesianGrid strokeDasharray="1 3"/>
                    <Tooltip/>
                    <Legend />
                    <Line type="monotone" dataKey="height" stroke={chartColors[0]} />
                </LineChart>
            </ResponsiveContainer>

        );
    }
}
