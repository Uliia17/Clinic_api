import { Navigate } from "react-router-dom";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {

    const user = useSelector((state: RootState) => state.auth.me);

    return user ? children : <Navigate to="/login" replace />;
};
