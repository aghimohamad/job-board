import axios from 'axios';
import {env} from "@/constants/config.ts";

const baseApi = axios.create({
    baseURL: env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    })

export default baseApi