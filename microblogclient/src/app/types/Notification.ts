import { Posts } from "./Posts"
import { Profile } from "./Profile"

export type Notification = {
    id: number,
    created: Date,
    who_notified: Profile,
    who_was_notified: Profile,
    notification_type: string,
    was_seen: boolean,
    post?: Posts
}