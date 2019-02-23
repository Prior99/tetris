import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import * as React from "react";
import { Loader } from "loader";

@external @observer
export class LoaderScreen extends React.Component {
    @inject private loader: Loader;

    public render() {
        return (
            <div>
                {this.loader.resources.map(({ status }) => <p>{status}</p>)};
            </div>
        );
    }
}
