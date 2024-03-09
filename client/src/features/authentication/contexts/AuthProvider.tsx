import {createContext, useEffect, useState} from "react"
import {currentUser, login as loginAsService, signup as signupAsService,
logout as logoutAsService
} from "@/features/authentication/services"
import {useLocation, useNavigate} from "react-router-dom";
import LogoutDialog from "@/features/authentication/pages/LogoutDialog.tsx";

type AuthContextType = {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string) => void;
    user: null | { email: string, id: string };
    loadingUser?: boolean;
}

export type User = {
    email: string;
    id: string;
}

const AuthContext = createContext<AuthContextType | null>(null);


const AuthProvider = ({children}: { children: React.ReactNode }) => {

    const navigate = useNavigate()
    const location = useLocation()

    const [user, setUser] = useState<null | User>(null)
    const [loadingUser , setLoadingUser] = useState(true)
    console.log(loadingUser);
    useEffect(() => {
        setLoadingUser(true)
        currentUser().then((user) => {
            console.log(user);
                if (user) {
                    setUser(user)
                }
        }).finally(() => setLoadingUser(false))
    }, [])

    const login = (email: string, password: string) => {
        return loginAsService(email, password).then((user) => {
            setUser(user)
            navigate(location.state?.location ?? "/")
        })
    }

    const [dialogOpen , setDialogOpen] = useState(false)

    const logout = () => {
        setDialogOpen(true)
        return logoutAsService().then(() => {
            setUser(null)
            setDialogOpen(false)
            navigate( '/tasks')
        }   )
    }

    const signup = (email: string, password: string) => {
        signupAsService(email, password).then((user) => {
            setUser(user)
            navigate(location.state?.location ?? '/')

        })
    }


    return (
        <AuthContext.Provider value={{login, logout, signup, user, loadingUser}}>
            <LogoutDialog isOpen={dialogOpen} />
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}