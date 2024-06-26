import axios from "axios";
import { createContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [token, setToken_] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({
    _id: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "",
  });

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
      setUser(jwtDecode(token));
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      setUser({
        _id: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "",
      });
    }
  }, [token]);

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      user,
      token,
      setToken,
    }),
    [token, user]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
