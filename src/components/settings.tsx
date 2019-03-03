import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { UI } from "ui";
import { Page } from "types";
import { AudioHit } from "resources";
import { Sounds } from "sounds";
import { bind } from "lodash-decorators";
import * as css from "./settings.scss";

export enum NetworkingMode {
    CLIENT = "client",
    HOST = "host",
    DISCONNECTED = "disconnected",
}

@external @observer
export class Settings extends React.Component {
    @inject private ui: UI;
    @inject private sounds: Sounds;

    public mode = NetworkingMode.DISCONNECTED;

    @bind private handleBack() {
        this.ui.page = Page.MENU;
    }

    get volumeMusic() { return this.ui.volumeMusic * 100; }

    get volumeSounds() { return this.ui.volumeSounds * 100; }

    @bind private handleVolumeMusic(evt: React.ChangeEvent<HTMLInputElement>) {
        this.ui.volumeMusic = Number(evt.currentTarget.value) / 100;
    }

    @bind private handleVolumeSounds(evt: React.ChangeEvent<HTMLInputElement>) {
        this.ui.volumeSounds = Number(evt.currentTarget.value) / 100;
        this.sounds.play(AudioHit);
    }

    public render() {
        return (
            <section className={css.settings}>
                <div className={css.wrapper}>
                    <h1>Settings</h1>
                    <div className={css.content}>
                        <p>Music</p>
                        <input
                            type="range"
                            min={1}
                            max={100}
                            value={this.volumeMusic}
                            onChange={this.handleVolumeMusic}
                        />
                        <p>Sounds</p>
                        <input
                            type="range"
                            min={1}
                            max={100}
                            value={this.volumeSounds}
                            onChange={this.handleVolumeSounds}
                        />
                        <a onClick={this.handleBack}>Back</a>
                    </div>
                </div>
            </section>
        );
    }
}
