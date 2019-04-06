import * as React from "react";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";
import { ResponsiveContainer, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Pie } from "recharts";
import { bind } from "lodash-decorators";
import { Interval, formatSeconds, chartColors } from "utils";
import { ActiveShape } from "../active-shape";

function combinationToString(combination: number) {
    switch (combination) {
        case 1: return "Single";
        case 2: return "Double";
        case 3: return "Triple";
        case 4: return "Tetris";
        default: return "unknown";
    }
}

@observer
export class ChartDistribution extends React.Component<{ overall: Interval | undefined }> {
    @observable private activeIndex = 0;

    @computed private get data(): { name: string, value: number }[] {
        if (!this.props.overall) { return []; }
        return Array.from(this.props.overall.lineDistribution.entries())
            .map(([combination, lines]) => ({
                name: combinationToString(combination),
                value: lines,
            }))
            .sort((a, b) => a.value - b.value);
    }

    @bind private doPieEnter(_, index: number) {
        this.activeIndex = index;
    }

    public render() {
        return (
            <PieChart style={{ margin: "auto" }} width={500} height={300}>
                <Pie
                    activeIndex={this.activeIndex}
                    activeShape={ActiveShape}
                    data={this.data}
                    cx={250}
                    cy={150}
                    innerRadius={80}
                    outerRadius={110}
                    onMouseEnter={this.doPieEnter}
                    dataKey="value"
                />
            </PieChart>
        );
    }
}
