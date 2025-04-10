import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, initialUser }) => {
  const isLoading = false; // Assuming no loading state is needed when using initial data

  // console.log('User in ProtectedRoute:', initialUser);

  if (isLoading) return null; // Wait for hydration if needed

  return initialUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
