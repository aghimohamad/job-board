import EditListingPage from "@/pages/jobs/editListingPage/Page.tsx";
import {loader} from "@/pages/jobs/editListingPage/loader.ts";
import PrivateRoute from "@/layouts/PrivateRoute.tsx";

export const editListingRoute = {
    element: <PrivateRoute>
        <EditListingPage/>
    </PrivateRoute>,
    loader: loader
}