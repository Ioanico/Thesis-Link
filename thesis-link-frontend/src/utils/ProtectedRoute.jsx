import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { useContext } from "react";

export const ProtectedRoute = () => {
    const { token } = useContext(AuthContext);

    if (!token) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};
