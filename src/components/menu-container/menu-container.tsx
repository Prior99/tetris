import * as React from "react";
import * as css from "./menu-container.scss";

export class MenuContainer extends React.Component {
    public render() {
        return (
            <div className={css.menuContainer}>
                {this.props.children}
            </div>
        );
    }
}
