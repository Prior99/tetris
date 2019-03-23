import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import * as React from "react";
import { Loader, LoadStatus } from "resources";
import * as css from "./loader-screen.scss";
import { Progress } from "semantic-ui-react";

@external @observer
export class LoaderScreen extends React.Component {
    @inject private loader: Loader;

    public get progress() {
        const done = this.loader.resources.filter(({ status }) => status === LoadStatus.DONE).length;
        return (done / this.loader.resources.length) * 100;
    }

    public render() {
        return (
            <section className={css.loader}>
                <div className={css.progressBar}>
                    <h1>Loading...</h1>
                    <Progress percent={this.progress} indicating />
                </div>
            </section>
        );
    }
}
