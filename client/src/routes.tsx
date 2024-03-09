import {Navigate, RouteObject} from "react-router-dom"
import {RootLayout} from "@/layouts/RootLayout"
import {ErrorPage} from "@/pages/ErrorPage"
import {TaskListPage} from "@/pages/tasks/TaskListPage"
import {NewTaskPage} from "@/pages/tasks/NewTaskPage"
import {NotFoundPage} from "@/pages/NotFoundPage"
import {AuthLayout, LoginForm, SignupForm} from "@/features/authentication";
import  {MyListingsRoute} from "@/pages/jobs/my-listings";
import NewListingPage from "@/pages/jobs/newListingPage.tsx";
import {editListingRoute} from "@/pages/jobs/editListingPage";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <RootLayout/>,
        children: [
            {
                errorElement: <ErrorPage/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="/tasks" replace/>,
                    },
                    {
                        path: "tasks",
                        children: [
                            {index: true, element: <TaskListPage/>},
                            {path: "new", element: <NewTaskPage/>},
                        ],
                    },
                    {
                        path: "jobs",
                        children: [
                            {index: true, ...MyListingsRoute},
                            {path: "new", element: <NewListingPage/>},
                            {path: ":id/edit" , ...editListingRoute},
                        ],
                    },
                    {
                        element: <AuthLayout/>,
                        children: [
                            {path: "login", element: <LoginForm/>},
                            {path: "signup", element: <SignupForm/>},
                        ],
                    },
                    {path: "*", element: <NotFoundPage/>},
                ],
            },
        ],
    },
]
