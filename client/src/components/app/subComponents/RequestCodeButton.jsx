import { useState, useEffect } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import FetchWithAuth from "../../auth/api";
import { useNotification } from "../../layout/NotificationHelper";

const RequestCodeButton = ({ email, setCodeSent }) => {
  const [timeLeft, setTimeLeft] = useState(5); // 5 minutes in seconds
  const [isRequestAllowed, setIsRequestAllowed] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup the timer
    } else {
      setIsRequestAllowed(true);
    }
  }, [timeLeft]);
  const handleRequestNewCode = async () => {
    if (isRequestAllowed && email) {
      setTimeLeft(300); // Reset the timer to 5 minutes
      setIsRequestAllowed(false);
      try {
        const response = await FetchWithAuth(
          `/auth/check-user/${email}`,
          {
            method: "GET",
            credentials: "include",
          },
          "Error finding associated user"
        );
        if (response.failed) {
          const { message } = response;
          addNotification(message, "error");
        } else {
          const { message, codeSent: code } = response;
          code && setCodeSent(true);
          message && addNotification(message);
        }
      } catch (error) {
        console.error("Error requesting new code:", error);
        addNotification("Error requesting new code", "error");
      }
    } else if (!email) {
      addNotification("Email is required to request a new code.", "warning");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      className={`flex justify-between items-center space-x-1 text-accent font-semibold ${
        isRequestAllowed ? "hover:underline cursor-pointer" : "text-gray-500 cursor-none"
      }`}
      onClick={handleRequestNewCode}>
      {isRequestAllowed ? <p>Request New Code</p> : <p>Next request in {formatTime(timeLeft)}</p>}
      {isRequestAllowed && (
        <ArrowPathIcon
          className={`w-5 h-5 transition-all duration-300 ease-out ${
            isRequestAllowed ? "hover:-rotate-45" : ""
          }`}
        />
      )}
    </div>
  );
};

RequestCodeButton.propTypes = {
  email: PropTypes.string.isRequired,
  setCodeSent: PropTypes.func.isRequired,
};

export default RequestCodeButton;
