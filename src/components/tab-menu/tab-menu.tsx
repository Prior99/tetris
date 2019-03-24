import * as React from "react";
import { external } from "tsdi";
import { observer } from "mobx-react";
import { bind } from "lodash-decorators";
import { observable } from "mobx";
import { Scoreboard } from "components/scoreboard";
import * as css from "./tab-menu.scss";

@external @observer
export class TabMenu extends React.Component {
    @observable private open = false;

    @bind private keyDown(evt: KeyboardEvent) {
        if (evt.key !== "Tab") { return; }
        evt.preventDefault();
        evt.stopPropagation();
        this.open = true;
    }

    @bind private keyUp(evt: KeyboardEvent) {
        if (evt.key !== "Tab") { return; }
        evt.preventDefault();
        evt.stopPropagation();
        this.open = false;
    }

    public componentDidMount() {
        window.addEventListener("keyup", this.keyUp);
        window.addEventListener("keydown", this.keyDown);
    }

    public componentWillUnmount() {
        window.removeEventListener("keyup", this.keyUp);
        window.removeEventListener("keydown", this.keyDown);
    }

    public render() {
        if (!this.open) { return <></>; }
        return (
            <div className={css.tabMenu}>
                <Scoreboard />
            </div>
        );
    }
}
