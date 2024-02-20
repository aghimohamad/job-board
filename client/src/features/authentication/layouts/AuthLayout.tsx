import {Outlet} from "react-router-dom";

export const AuthLayout = () => {
    return (
        <div
            className="fixed left-[50%] top-[50%] z-50 grid   translate-x-[-50%] translate-y-[-50%] "
        >
            <Outlet />
        </div>
    );
};

