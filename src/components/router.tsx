import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import * as React from "react";
import { Loader } from "loader";
import { SinglePlayer } from "./single-player";
import { Settings } from "./settings";
import { Menu } from "./menu";
import { LoaderScreen } from "./loader-screen";
import { Page, UI } from "ui";

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
        }
    }
}
