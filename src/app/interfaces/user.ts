import { UserSettings } from "./user-settings";

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    settings: UserSettings;
}
