import { observable, computed } from "mobx";
import { RemoteUser } from "types";

export class RemoteUsers {
    @observable public users = new Map<string, RemoteUser>();

    private ownId?: string;

    @computed public get own(): RemoteUser | undefined {
        if (!this.ownId) { return; }
        return this.users.get(this.ownId);
    }

    public setOwnUser(user: RemoteUser) {
        this.add(user);
        this.ownId = user.id;
    }

    public add(...users: RemoteUser[]) {
        users.forEach(user => this.users.set(user.id, user));
    }

    @computed public get all() {
        return Array.from(this.users.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    public byId(id: string) {
        return this.users.get(id);
    }
}
