import PublicListingsPage from "./page";
import { publicListingsLoader } from "./loader";

export const PublicListingsRoute = {
    element: (
            <PublicListingsPage/>
    ),
    loader: publicListingsLoader
}