import { Role } from "./role.types";

export interface AuthenticatedUser {
    _id: string;
    email: string;
    firstName: string;
    lastName?: string;
    avatar: string;
    role: Role[];
}

export interface AuthenticatedUserWithToken extends AuthenticatedUser {
    access_token: string;
}
