// Load and save accessToken to localStorage
const saveAccessToken = (accessToken) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken); // Store as a simple string
  } else {
    localStorage.removeItem("accessToken");
  }
};
// Load and save refreshToken to localStorage
const saveRefreshToken = (refreshToken) => {
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken); // Store as a simple string
  } else {
    localStorage.removeItem("refreshToken");
  }
};
// Load and save user to localStorage
const saveUserToLocal = (user) => {
  if (user) {
    localStorage.setItem("zenithUser", JSON.stringify(user)); // Store as a simple string
  } else {
    localStorage.removeItem("zenithUser");
  }
};

// Retrieve accessToken directly from localStorage
const getInitialAccessToken = () => {
  return localStorage.getItem("accessToken"); // Retrieve token as a simple string
};
// Retrieve accessToken directly from localStorage
const getRefreshToken = () => {
  return localStorage.getItem("refreshToken"); // Retrieve token as a simple string
};
// Retrieve accessToken directly from localStorage
const getUserFromLocal = () => {
  return JSON.parse(localStorage.getItem("zenithUser")) || null;
};
// Open (or create) the database
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("authDb", 1);
    // Create the schema if needed
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("zenithToken")) {
        db.createObjectStore("zenithToken", { keyPath: "id" });
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}
async function storeRefreshToken(token) {
  const db = await openDatabase();
  const transaction = db.transaction("zenithToken", "readwrite");
  const store = transaction.objectStore("zenithToken");

  // Save the token with a specific ID (e.g., "refreshToken")
  const request = store.put({ id: "refreshToken", value: token });
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
}
async function getRefreshTokenFromDb() {
  const db = await openDatabase();
  const transaction = db.transaction("zenithToken", "readonly");
  const store = transaction.objectStore("zenithToken");

  // Retrieve the token by its ID
  const request = store.get("refreshToken");
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.value);
      } else {
        resolve(null); // Token not found
      }
    };
    request.onerror = (event) => reject(event.target.error);
  });
}
async function deleteRefreshTokenFromDb() {
  const db = await openDatabase();
  const transaction = db.transaction("zenithToken", "readwrite"); // Use readwrite for deletion
  const store = transaction.objectStore("zenithToken");

  // Delete the token by its ID
  const request = store.delete("refreshToken");

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(true); // Indicate successful deletion
    };
    request.onerror = (event) => reject(event.target.error); // Handle error
  });
}
function isValidPassword(password) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const result = pattern.test(password);
  return result ? true : "Requires an uppercase, lowercase letter, a number and a symbol";
}
export {
  saveAccessToken,
  getInitialAccessToken,
  saveRefreshToken,
  getRefreshToken,
  openDatabase,
  storeRefreshToken,
  getRefreshTokenFromDb,
  deleteRefreshTokenFromDb,
  isValidPassword,
  saveUserToLocal,
  getUserFromLocal,
};
