import { Role } from "./role.type";

export interface UserPayload {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    role: Role[];
  }

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    avatar: string;
    role: Role[];
  }