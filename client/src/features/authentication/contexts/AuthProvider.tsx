import {createContext, useEffect, useState} from "react"
import {currentUser, login as loginAsService, signup as signupAsService,
logout as logoutAsService
} from "@/features/authentication/services"
import {useNavigate} from "react-router-dom";
import LogoutDialog from "@/features/authentication/pages/LogoutDialog.tsx";

type AuthContextType = {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string) => void;
    user: null | { email: string, id: string };
}

const AuthContext = createContext<AuthContextType | null>(null);


const AuthProvider = ({children}: { children: React.ReactNode }) => {

    const navigate = useNavigate()

    const [user, setUser] = useState<null | { email: string, id: string }>(null)

    useEffect(() => {
        currentUser().then((user) => {
            if (user) {
                setUser(user)
            }
        })
    }, [])

    const login = (email: string, password: string) => {
        return loginAsService(email, password).then((user) => {
            setUser(user)
            navigate('/tasks')
        })
    }

    const [dialogOpen , setDialogOpen] = useState(false)

    const logout = () => {
        setDialogOpen(true)
        return logoutAsService().then(() => {
            setUser(null)
            setDialogOpen(false)
            navigate('/login')
        }   )
    }

    const signup = (email: string, password: string) => {
        signupAsService(email, password).then((user) => {
            console.log('signup', user)

        })
    }


    return (
        <AuthContext.Provider value={{login, logout, signup, user}}>
            <LogoutDialog isOpen={dialogOpen} />
            {children}
        </AuthContext.Provider>
    )
}

export {AuthContext, AuthProvider}