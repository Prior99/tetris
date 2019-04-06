import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { bind } from "lodash-decorators";
import { Button, Segment } from "semantic-ui-react";
import { UI } from "ui";
import { ObservableGame } from "observable-game";
import { Statistics } from "../statistics";
import * as css from "./statistics-menu.scss";

@external @observer
export class StatisticsMenu extends React.Component {
    @inject private ui: UI;
    @inject private observableGame: ObservableGame;

    @bind private handleClose() {
        this.ui.showStats = false;
    }

    public render() {
        if (!this.ui.showStats) { return <></>; }
        return (
            <div className={css.statisticsMenu}>
                <Segment>
                    <h1>Statistics</h1>
                    <Statistics intervals={this.observableGame.intervals} />
                    <Button primary onClick={this.handleClose}>Close</Button>
                </Segment>
            </div>
        );
    }
}
