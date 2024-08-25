import PrivateRoute from "@/layouts/PrivateRoute";
import loader from "./loader";
import { OrderCompletePage } from './page';


export const orderCompleteRoute = {
    element: <PrivateRoute><OrderCompletePage/></PrivateRoute >,
    loader,
}