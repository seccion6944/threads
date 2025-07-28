import { useAuthState } from "react-firebase-hooks/auth";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";

export default function RedirectIfAuth({ children }) {
    const [user, loading] = useAuthState(auth);

    if (loading) return <p></p>;
    if (user) return <Navigate to="/inicio" replace />;

    return children;
}
