import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await fetch("http://localhost:3000/auth-check", {
          credentials: "include",
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        // Handle errors
        console.error(error);
      }
    }

    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

/* import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null);

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
 */
