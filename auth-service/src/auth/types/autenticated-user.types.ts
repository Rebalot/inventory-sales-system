import { Role } from "src/users/types/role.types";


export interface AuthenticatedUser {
    _id: string;
    email: string;
    firstName: string;
    lastName?: string;
    avatar: string;
    role: Role[];
}