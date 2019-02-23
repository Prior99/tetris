import { component } from "tsdi";
import { observable } from "mobx";
import { RemoteUser } from "./messages";

@component
export class RemoteUsers {
    @observable public users = new Map<string, RemoteUser>();

    public add(...users: RemoteUser[]) {
        users.forEach(user => this.users.set(user.id, user));
    }

    public get all() {
        return Array.from(this.users.values()).sort((a, b) => a.name.localeCompare(b.name));
    }
}
