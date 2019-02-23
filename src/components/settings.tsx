import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { UI, Page } from "ui";
import { Sounds, AudioHit } from "audio";
import { bind } from "lodash-decorators";
import * as css from "./settings.scss";

@external @observer
export class Settings extends React.Component {
    @inject private ui: UI;
    @inject private sounds: Sounds;

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
                    <p>Music</p>
                    <input type="range" min={1} max={100} value={this.volumeMusic} onChange={this.handleVolumeMusic}/>
                    <p>Sounds</p>
                    <input type="range" min={1} max={100} value={this.volumeSounds} onChange={this.handleVolumeSounds}/>
                    <a onClick={this.handleBack}>Back</a>
                </div>
            </section>
        );
    }
}
