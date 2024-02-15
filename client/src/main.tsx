import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { routes } from "./routes.tsx"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import {ThemeProvider} from "@/theme/themeProvider.tsx";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
      <ThemeProvider>
    <RouterProvider router={createBrowserRouter(routes)} />
        </ThemeProvider>
  </StrictMode>
)
