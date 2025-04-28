import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import PropTypes from "prop-types";
import { useEffect } from "react";

const CheckAuth = ({ children }) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (accessToken) {
      if (location.pathname.startsWith("/auth/")) {
        navigate("/app/dashboard", { replace: true });
      }
    }
  }, [accessToken, navigate, location.pathname]);

  return !accessToken ? children : null;
};

CheckAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CheckAuth;
