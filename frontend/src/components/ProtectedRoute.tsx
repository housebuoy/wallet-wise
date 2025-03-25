import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ScaleLoader from "react-spinners/ScaleLoader";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) return <main className="min-h-screen flex items-center justify-center"><ScaleLoader color="#6f59a6"/></main>;

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
