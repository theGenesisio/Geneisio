import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../layout/NotificationHelper";

const VerifyEmail = () => {
  const [status, setStatus] = useState("Verifying...");
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  useEffect(() => {
    if (token) {
      fetch(`${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`)
        .then(async (response) => {
          const data = await response.json();
          if (response.ok) {
            setStatus(data.message);
            addNotification(data.message, "success");
            // Remove token from URL
            navigate("/auth/login", { replace: true });
          } else {
            setStatus(data.message || "Verification failed or token expired.");
            addNotification(data.message, "error");
          }
        })
        .catch(() => setStatus("Verification failed or token expired."));
    } else {
      setStatus("Invalid verification link.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  return <div>{status}</div>;
};

export default VerifyEmail;
