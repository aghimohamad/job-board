import baseApi from "@/services/baseApi.ts";

export const signup = async (email: string, password: string) => {
    const response = await baseApi.post("/users/signup", {
        email,
        password,
    })
    return response.data
}

export const login = async (email: string, password: string) => {
    const response = await baseApi.post("/users/login", {
        email,
        password,
    })
    return response.data
}

export const currentUser = async () => {
    const response = await baseApi.get("/users/session")
    return response.data
}

export const logout = async () => {
    const response = await baseApi.delete("/users/logout")
    return response.data
}