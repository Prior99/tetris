import { component } from "tsdi";
import { RemoteUser } from "./messages";

@component
export class RemoteUsers {
    public users = new Map<string, RemoteUser>();

    public add(...users: RemoteUser[]) {
        users.forEach(user => this.users.set(user.id, user));
    }

    public get all() {
        return Array.from(this.users.values()).sort((a, b) => a.name.localeCompare(b.name));
    }

    public byId(id: string) {
        return this.users.get(id);
    }
}
