import { User } from "./User";

export type Posts = {
    id: number,
    body: string,
    owner: User,
    created: Date
}