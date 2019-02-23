import * as React from "react";
import { GameCanvas } from "./game-canvas";
import { Info } from "./info";

export class Game extends React.Component {
    public render() {
        return (
            <>
                <GameCanvas />
                <Info />
            </>
        );
    }
}
