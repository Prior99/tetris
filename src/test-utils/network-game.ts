import { RemoteGameState } from "types";
import { NetworkGame } from "../networking/network-game";
import { RemoteUsers } from "../networking/remote-users";

export function createNetworkGame(remoteUsers: RemoteUsers): NetworkGame {
    const networkGame = new NetworkGame(remoteUsers);
    return networkGame;
}

export function updateNetworkGameState(networkGame: NetworkGame, userId: string, state: Partial<RemoteGameState>) {
    networkGame.update(userId, networkGame.playfieldForUser(userId)!, {
        ...networkGame.stateForUser(userId)!,
        ...state,
    });
}
