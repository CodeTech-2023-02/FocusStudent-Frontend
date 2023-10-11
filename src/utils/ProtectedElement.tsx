import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext";

interface ProtectedElementProps {
  roles?: string[]; 
  children: React.ReactElement;
}

const ProtectedElement: React.FC<ProtectedElementProps> = ({
  roles,
  children,
}) => {
  const auth = useAuth();

  if (!auth || !auth.currentUser) {
    return <Navigate to="/login" />;
  }

  const { currentUser } = auth;

  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedElement;
