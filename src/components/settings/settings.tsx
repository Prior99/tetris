import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { History } from "history";
import { Slider } from "react-semantic-ui-range";
import { UI } from "ui";
import { Page } from "types";
import { AudioHit } from "resources";
import { Sounds } from "sounds";
import { bind } from "lodash-decorators";
import { MenuContainer } from "components/menu-container";
import { Segment, Form, Button } from "semantic-ui-react";

export enum NetworkingMode {
    CLIENT = "client",
    HOST = "host",
    DISCONNECTED = "disconnected",
}

@external @observer
export class Settings extends React.Component {
    @inject private ui: UI;
    @inject private sounds: Sounds;
    @inject("History") private history: History;

    public mode = NetworkingMode.DISCONNECTED;

    @bind private handleBack() { this.history.push("/main-menu"); }

    get volumeMusic() { return this.ui.volumeMusic * 100; }

    get volumeSounds() { return this.ui.volumeSounds * 100; }

    @bind private handleVolumeMusic(value: number) {
        this.ui.volumeMusic = value / 100;
    }

    @bind private handleVolumeSounds(value: number) {
        this.ui.volumeSounds = value / 100;
        this.sounds.play(AudioHit);
    }

    public render() {
        return (
            <MenuContainer>
                <Segment>
                    <h1>Settings</h1>
                    <Form>
                        <Form.Field label="Music" />
                        <Slider
                            color="blue"
                            settings={{
                                start: this.volumeMusic,
                                min: 0,
                                max: 100,
                                step: 1,
                                onChange: this.handleVolumeMusic,
                            }}
                        />
                        <br />
                        <Form.Field label="Sounds" />
                        <Slider
                            color="blue"
                            settings={{
                                start: this.volumeSounds,
                                min: 0,
                                max: 100,
                                step: 1,
                                onChange: this.handleVolumeSounds,
                            }}
                        />
                        <br />
                        <Button primary fluid onClick={this.handleBack}>Back</Button>
                    </Form>
                </Segment>
            </MenuContainer>
        );
    }
}
