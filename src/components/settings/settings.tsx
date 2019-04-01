import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { History } from "history";
import { Slider } from "react-semantic-ui-range";
import { UI } from "ui";
import { AudioHit } from "resources";
import { Sounds } from "sounds";
import { bind } from "lodash-decorators";
import { MenuContainer } from "components/menu-container";
import { Segment, Form, Button } from "semantic-ui-react";
import { SettingsForm } from "../settings-form";

@external @observer
export class Settings extends React.Component {
    @inject("History") private history: History;

    @bind private handleBack() { this.history.push("/main-menu"); }

    public render() {
        return (
            <MenuContainer>
                <Segment>
                    <h1>Settings</h1>
                    <SettingsForm />
                    <Button primary fluid onClick={this.handleBack}>Back</Button>
                </Segment>
            </MenuContainer>
        );
    }
}
