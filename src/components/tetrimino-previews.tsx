import * as React from "react";
import { external, inject } from "tsdi";
import { ShuffleBag } from "game";
import { observer } from "mobx-react";
import { TetriminoPreview } from "./tetrimino-preview";
import * as css from "./tetrimino-previews.scss";

@external @observer
export class TetriminoPreviews extends React.Component {
    @inject private shuffleBag: ShuffleBag;

    public render() {
        return (
            <div className={css.tetriminoPreviews}>
                {this.shuffleBag.preview.map(({ matrix }, index) => <TetriminoPreview key={index} matrix={matrix} />)}
            </div>
        );
    }
}
