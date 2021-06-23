import { Profile } from "./Profile";

export type Posts = {
    id: number,
    body: string,
    owner: Profile,
    created: Date,
    like_count: number,
    liked: boolean

}