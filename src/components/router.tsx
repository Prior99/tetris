import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import * as React from "react";
import { Loader } from "loader";
import { SinglePlayer } from "./single-player";
import { Settings } from "./settings";
import { Menu } from "./menu";
import { LoaderScreen } from "./loader-screen";
import { Connect } from "./connect";
import { Lobby } from "./lobby";
import { MultiPlayer } from "./multi-player";
import { Page, UI } from "ui";
import { LeaderboardView } from "./leaderboard-view";

@external @observer
export class Router extends React.Component {
    @inject private loader: Loader;
    @inject private ui: UI;

    public render() {
        if (!this.loader.done) { return <LoaderScreen />; }
        switch (this.ui.page) {
            case Page.MENU: return <Menu />;
            case Page.SINGLE_PLAYER: return <SinglePlayer />;
            case Page.SETTINGS: return <Settings />;
            case Page.LOBBY: return <Lobby />;
            case Page.CONNECT: return <Connect />;
            case Page.MULTI_PLAYER: return <MultiPlayer />;
            case Page.LEADERBOARD: return <LeaderboardView />;
        }
    }
}
