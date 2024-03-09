import {useAuth} from "@/features/authentication";
import {Navigate, useLocation} from "react-router-dom";
import {ReactNode} from "react";
import {LoadingSpinner} from "@/components/ui/LoadingSpinner.tsx";


const PrivateRoute = ({children}: { children: ReactNode }) => {

    const {user, loadingUser} = useAuth();
    console.log(user);
    const location = useLocation();
    console.log(loadingUser , "loadingUser");
    if (loadingUser) return <LoadingSpinner className="w-24 h-24" />

    if (!user) {
        return <Navigate to="/login" replace state={{ location }} />;
    }

    return children;
};

export default PrivateRoute;