import {useContext} from "react";
import {ThemeContext} from "@/theme/themeProvider.tsx";

export const themes = ['light', 'dark', 'system'] as const

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}