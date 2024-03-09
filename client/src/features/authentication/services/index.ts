import baseApi from "@/services/baseApi.ts";
import {User} from "@/features/authentication/contexts/AuthProvider.tsx";

export const signup =  (email: string, password: string) => {
    const response =  baseApi.post("/users/signup", {
        email,
        password,
    }).then(res => res.data)
    return response
}

export const login =  (email: string, password: string) => {
    const response =  baseApi.post("/users/login", {
        email,
        password,
    }).then(res => res.data)
    return response
}

export const currentUser =  () => {
   return  baseApi.get<User | undefined>("/users/session")
        .then(res => res.data )
}

export const logout =  () => {
    const response =  baseApi.delete("/users/logout").then(res => res.data)
    return response
}