export interface ResponseJson {
    error?: string;
    message?: string;
}

export interface User {
    id: string;
    username: string;
    role: UserRole;
}

export interface UserPayload extends User {
    authToken : string | undefined;
}

export type UserRole = "customer" | "admin"