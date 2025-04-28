import { useState, useEffect } from "react";
import { useNotification } from "../layout/NotificationHelper";
import PropTypes from "prop-types";
import AuthContext from "./AuthContextHelper";
import FetchWithAuth from "./api.js";
import {
  saveAccessToken,
  getInitialAccessToken,
  getRefreshToken,
  saveRefreshToken,
  openDatabase,
  storeRefreshToken,
  deleteRefreshTokenFromDb,
  saveUserToLocal,
  getUserFromLocal,
} from "./authHelpers";

const AuthProvider = ({ children }) => {
  const { addNotification } = useNotification();
  const [user, setUser] = useState(getUserFromLocal);
  const [accessToken, setAccessToken] = useState(getInitialAccessToken);
  const [refreshToken, setRefreshToken] = useState(getRefreshToken);
  const [dbSupported, setDbsupported] = useState(false);

  useEffect(() => {
    setDbsupported(!!window.indexedDB);
  }, []);

  useEffect(() => {
    if (dbSupported) {
      openDatabase()
        .then((db) => console.log("IndexedDB supported and initialized:", db))
        .catch((error) => {
          console.error("Error initializing IndexedDB:", error);
          console.log("Using fallback");
          setDbsupported(false); // Fallback to alternative if IndexedDB fails
        });
    }
  }, [dbSupported]);

  useEffect(() => {
    if (refreshToken && dbSupported) {
      storeRefreshToken(refreshToken)
        .then(() => console.log("Token stored successfully"))
        .catch((error) => {
          console.error("Error storing token in IndexedDB:", error);
          console.log("Using fallback");
          saveRefreshToken(refreshToken); // Fallback to alternative storage
        });
    } else if (refreshToken) {
      saveRefreshToken(refreshToken); // Fallback for non-IndexedDB support
    }
  }, [refreshToken, dbSupported]);

  useEffect(() => {
    saveAccessToken(accessToken);
  }, [accessToken]);

  const updateUser = (userData, userAccessToken, userRefreshToken) => {
    setUser(userData);
    saveUserToLocal(userData);
    setAccessToken(userAccessToken);
    setRefreshToken(userRefreshToken);
    return true;
  };

  const logout = async () => {
    try {
      // Call the logout API route
      const response = await FetchWithAuth(
        `/auth/logout`,
        {
          method: "DELETE",
          body: JSON.stringify({ refreshToken: getRefreshToken() || refreshToken }), // Assuming getRefreshToken() retrieves the current refresh token
          credentials: "include",
        },
        "Failed to logout"
      );
      console.log("Context:", response?.message);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Existing logout functions
      setUser(null);
      saveUserToLocal(null);
      setAccessToken(null);
      deleteRefreshTokenFromDb();
      saveRefreshToken(null);
      addNotification("Logging out", "warning");
    }
  };
  const refreshUser = async () => {
    try {
      // Call the user API route
      const response = await FetchWithAuth(
        `/user`,
        {
          method: "GET",
          credentials: "include",
        },
        "Failed to refresh user"
      );
      console.log("Context:", response?.message);
      if (response.user) {
        setUser(response.user);
        saveUserToLocal(response.user);
      }
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  useEffect(() => {
    refreshUser(); // Run on page load
    const intervalId = setInterval(refreshUser, 300000); // 300000ms = 5 minutes
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  return (
    <AuthContext.Provider value={{ user, accessToken, updateUser, setUser, logout, dbSupported }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
