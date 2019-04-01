import { inject } from "tsdi";
import * as React from "react";
import { observer } from "mobx-react";
import { Segment, Table } from "semantic-ui-react";
import { Scoreboard } from "../scoreboard";

@observer
export class ScoreboardMenu extends React.Component {
    public render() {
        return (
            <Segment>
                <h1>Scoreboard</h1>
                <ScoreboardMenu />
            </Segment>
        );
    }
}
