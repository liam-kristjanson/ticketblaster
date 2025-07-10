import { createContext } from "react";
import type { User } from "types";

const nullUser = {
    _id: "",
    username: "",
    password: "",
    role: "",
}

export const AuthContext = createContext<User>(nullUser)