import { createContext, useState, type Dispatch, type ReactNode} from "react";
import type { User } from "types";

export const AuthContext = createContext<{user: User | null; setUser : Dispatch<User | null>}>({user: null, setUser: (u : User | null) => {}});

type AuthProviderProps = {
    children : ReactNode;
}

export function AuthProvider({children} : AuthProviderProps) {

    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}