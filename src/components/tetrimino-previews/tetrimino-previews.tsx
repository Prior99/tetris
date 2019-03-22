import * as React from "react";
import { external, inject } from "tsdi";
import { observer } from "mobx-react";
import { ObservableGame } from "observable-game";
import { TetriminoPreview } from "../tetrimino-preview";
import * as css from "./tetrimino-previews.scss";

@external @observer
export class TetriminoPreviews extends React.Component {
    @inject private game: ObservableGame;

    public render() {
        return (
            <div className={css.tetriminoPreviews}>
                {this.game.tetriminoPreview.map((matrix, index) => <TetriminoPreview key={index} matrix={matrix} />)}
            </div>
        );
    }
}
