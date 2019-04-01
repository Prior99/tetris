import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { Slider } from "react-semantic-ui-range";
import { UI } from "ui";
import { AudioHit } from "resources";
import { Sounds } from "sounds";
import { bind } from "lodash-decorators";
import { MenuContainer } from "components/menu-container";
import { Segment, Form, Button } from "semantic-ui-react";

@external @observer
export class SettingsForm extends React.Component {
    @inject private ui: UI;
    @inject private sounds: Sounds;

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
            </Form>
        );
    }
}
