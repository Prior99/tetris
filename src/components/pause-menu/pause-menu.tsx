import { external, inject } from "tsdi";
import * as React from "react";
import { observer } from "mobx-react";
import { Networking } from "networking";
import { Button, Segment, Table } from "semantic-ui-react";
import { Scoreboard } from "../scoreboard";
import { SettingsForm } from "components/settings-form";
import * as css from "./pause-menu.scss";

export interface PauseMenuProps {
    onResign: () => void;
    onResume: () => void;
    open: boolean;
}

@external @observer
export class PauseMenu extends React.Component<PauseMenuProps> {
    @inject private networking: Networking;
    public render() {
        if (!this.props.open) { return <></>; }
        return (
            <div className={css.pauseMenu}>
                <Segment>
                    <h1>Game Paused</h1>
                    { this.networking.gameOngoing && <Scoreboard />}
                    <SettingsForm />
                    <Button fluid onClick={this.props.onResign}>Give up</Button>
                    <Button fluid primary onClick={this.props.onResume}>Resume</Button>
                </Segment>
            </div>
        );
    }
}
