import { external, inject } from "tsdi";
import * as React from "react";
import { observer } from "mobx-react";
import { observable } from "mobx";
import { Button, Segment, Accordion } from "semantic-ui-react";
import { bind } from "lodash-decorators";
import { Networking } from "networking";
import { ObservableGame } from "observable-game";
import { Scoreboard } from "../scoreboard";
import { SettingsForm } from "../settings-form";
import { StatisticsMenu } from "../statistics-menu";
import * as css from "./pause-menu.scss";

export interface PauseMenuProps {
    onResign: () => void;
    onResume: () => void;
    open: boolean;
}

@external @observer
export class PauseMenu extends React.Component<PauseMenuProps> {
    @inject private networking: Networking;
    @inject private observableGame: ObservableGame;

    @observable private activeIndex = 1;

    @bind private handleAccordion (_, { index }: { index: number }) {
        this.activeIndex = index;
    }

    public render() {
        if (!this.props.open) { return <></>; }
        return (
            <div className={css.pauseMenu}>
                <Segment>
                    <h1>Game Paused</h1>
                    { this.networking.gameOngoing && <Scoreboard />}
                    <Accordion>
                        <Accordion.Title active={this.activeIndex === 0} index={0} onClick={this.handleAccordion}>
                            Settings
                        </Accordion.Title>
                        <Accordion.Content active={this.activeIndex === 0}><SettingsForm /></Accordion.Content>
                        <Accordion.Title active={this.activeIndex === 1} index={1} onClick={this.handleAccordion}>
                            Statistics
                        </Accordion.Title>
                        <Accordion.Content active={this.activeIndex === 1}>
                            <StatisticsMenu intervals={this.observableGame.intervals} />
                        </Accordion.Content>
                    </Accordion>
                    <Button.Group fluid>
                        <Button onClick={this.props.onResign}>Give up</Button>
                        <Button primary onClick={this.props.onResume}>Resume</Button>
                    </Button.Group>
                </Segment>
            </div>
        );
    }
}
