import { Role } from "./role.type";

export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName?: string;
    avatar: string;
    role: Role[];
}
