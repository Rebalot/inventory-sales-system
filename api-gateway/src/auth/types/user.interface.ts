import { Role } from "./role.type";

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name?: string;
    avatar: string;
    role: Role[];
}
