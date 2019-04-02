import * as React from "react";
import { observer } from "mobx-react";
import { Segment } from "semantic-ui-react";

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
