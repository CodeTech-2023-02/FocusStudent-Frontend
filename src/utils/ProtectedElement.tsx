import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

interface ProtectedElementProps {
  role?: string;
  children: React.ReactElement;
}

const ProtectedElement: React.FC<ProtectedElementProps> = ({
  role,
  children,
}) => {
  const auth = useAuth();

  if (!auth || !auth.currentUser) {
    return <Navigate to="/login" />;
  }

  const { currentUser } = auth;

  if (role && currentUser.role !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedElement;
