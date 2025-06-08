import { Types } from "mongoose";
import { Role } from "./role.type";

export interface UserPayload {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    role: Role[];
  }

export interface UserResponse {
    id: Types.ObjectId;
    email: string;
    firstName: string;
    lastName?: string;
    avatar: string;
    role: Role[];
  }