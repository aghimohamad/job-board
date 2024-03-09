import PrivateRoute from "@/layouts/PrivateRoute.tsx";
import MyListingsPage from "@/pages/jobs/my-listings/page.tsx";
import {myListingsLoader} from "@/pages/jobs/my-listings/loader.ts";

export const MyListingsRoute = {
    element: (
        <PrivateRoute>
            <MyListingsPage/>
        </PrivateRoute>
    ),
    loader: myListingsLoader
}