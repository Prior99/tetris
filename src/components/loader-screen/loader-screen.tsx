import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import * as React from "react";
import { Loader } from "resources";
import * as css from "./loader-screen.scss";

@external @observer
export class LoaderScreen extends React.Component {
    @inject private loader: Loader;

    public get statusArray() {
        return this.loader.resources.map(({ status }, index) => <div key={index} className={css[status]} />);
    }

    public render() {
        return (
            <section className={css.loader}>
                <div className={css.wrapper}>
                    {this.statusArray}
                </div>
            </section>
        );
    }
}
