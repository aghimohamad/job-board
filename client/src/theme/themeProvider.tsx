import {useLocalStorage} from "@/hooks/useLocalStorage.ts";
import {createContext, useLayoutEffect} from "react";
import {themes} from "@/hooks/useTheme.ts";


interface ThemeContextType {
    theme: typeof themes[number]
    toggleTheme: (theme?: typeof themes[number]) => void
}


export const ThemeContext = createContext<ThemeContextType | null>(null)



export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('theme', 'system')

    const toggleTheme = (theme?: typeof themes[number]) => {
        if (theme) {
            setTheme(theme)
        } else {
            setTheme(prevTheme => {
                if (prevTheme === 'system') {
                    return 'light'
                } else if (prevTheme === 'light') {
                    return 'dark'
                } else {
                    return 'system'
                }
            })
        }
    }

    useLayoutEffect(() => {
        if (theme === 'system') {
            const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"

            document.documentElement.classList.toggle("dark", theme === "dark")
        }
        if  (theme === 'dark') {
            document.documentElement.classList.add('dark')
        }
        if  (theme === 'light') {
            document.documentElement.classList.remove('dark')
        }
    }, [ theme, setTheme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

