import { Role } from "./role.type";

export interface CreateUserPayload {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    role: Role[];
  }

export interface CreatedUser {
    _id: string;
    email: string;
    firstName: string;
    lastName?: string;
    avatar: string;
    role: Role[];
  }