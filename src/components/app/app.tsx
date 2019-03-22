import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import * as React from "react";
import { Loader } from "resources";
import { UI } from "ui";
import { Page } from "types";
import { SinglePlayer } from "../single-player";
import { Settings } from "../settings";
import { Menu } from "../menu";
import { LoaderScreen } from "../loader-screen";
import { Connect } from "../connect";
import { Lobby } from "../lobby";
import { MultiPlayer } from "../multi-player";
import { LeaderboardView } from "../leaderboard-view";
import { SinglePlayerSetup } from "../single-player-setup";
import { Background } from "../background";

@external @observer
export class App extends React.Component {
    @inject private loader: Loader;
    @inject private ui: UI;

    public renderContent() {
        switch (this.ui.page) {
            case Page.MENU: return <Menu />;
            case Page.SINGLE_PLAYER: return <SinglePlayer />;
            case Page.SETTINGS: return <Settings />;
            case Page.LOBBY: return <Lobby />;
            case Page.CONNECT: return <Connect />;
            case Page.MULTI_PLAYER: return <MultiPlayer />;
            case Page.LEADERBOARD: return <LeaderboardView />;
            case Page.SINGLE_PLAYER_SETUP: return <SinglePlayerSetup />;
        }
    }

    public render() {
        if (!this.loader.done) { return <LoaderScreen />; }
        return (
            <>
                <Background />
                {this.renderContent()}
            </>
        );
    }
}
