import { Navigate } from "react-router-dom";
import useAuth from "./useAuth";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { accessToken, user } = useAuth();
  // Ensure both user and accessToken are present before rendering children
  if (user && accessToken) {
    return children;
  }

  // Redirect to login if user or accessToken is not available
  return <Navigate to='/auth/login' replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
