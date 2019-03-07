import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { computed } from "mobx";
import * as React from "react";
import { Loader, LoadStatus } from "resources";
import * as css from "./loader-screen.scss";

@external @observer
export class LoaderScreen extends React.Component {
    @inject private loader: Loader;

    @computed private get statusArray() {
        return this.loader.resources.map(({ status }, index) => <div key={index} className={css[status]} />);
    }

    @computed private get current(): string[] {
        return this.loader.resources
            .filter(({ status }) => status === LoadStatus.IN_PROGRESS)
            .map(({ name }) => name);
    }

    public render() {
        return (
            <section className={css.loader}>
                <div className={css.wrapper}>
                    {this.statusArray}
                    <div className={css.names}>
                        {this.current.map(name => <p key={name}>Loading {name} ...</p>)}
                    </div>
                </div>
            </section>
        );
    }
}
