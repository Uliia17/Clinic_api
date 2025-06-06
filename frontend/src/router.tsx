import { createBrowserRouter} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DoctorsPage } from "./pages/DoctorsPage";
import { ClinicsPage } from "./pages/ClinicsPage";
import { ServicesPage } from "./pages/ServicesPage";
import {MainLayout} from "./layouts/MainLayout";
import {PrivateRoute} from "./components/PrivateRouteComponent";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <div>Сторінку не знайдено (404)</div>, // опціонально, але бажано
        children: [
            { index: true, element: <HomePage /> }, // головна сторінка
            { path: "login", element: <LoginPage /> },
            { path: "register", element: <RegisterPage /> },
            {
                path: "doctors",
                element: (
                    <PrivateRoute>
                        <DoctorsPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "clinics",
                element: (
                    <PrivateRoute>
                        <ClinicsPage />
                    </PrivateRoute>
                ),
            },
            {
                path: "services",
                element: (
                    <PrivateRoute>
                        <ServicesPage />
                    </PrivateRoute>
                ),
            },
        ],
    },
]);

export default router;

