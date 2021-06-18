import { Profile } from "./Profile";

export type Posts = {
    id: number,
    body: string,
    owner: Profile,
    created: Date
}