import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import * as React from "react";
import { Loader } from "loader";
import { Game } from "./game";
import { LoaderScreen } from "./loader-screen";

@external @observer
export class Router extends React.Component {
    @inject private loader: Loader;

    public render() {
        if (this.loader.done) { return <Game />; }
        return <LoaderScreen />;
    }
}
