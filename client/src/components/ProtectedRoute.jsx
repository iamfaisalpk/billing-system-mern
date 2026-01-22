import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/authStore";

const ProtectedRoute = ({ children }) => {
    const { token, isAuthenticated } = useAuthStore();

    const isAuthValid = token && isAuthenticated();

    const location = useLocation();

    if (!isAuthValid) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;