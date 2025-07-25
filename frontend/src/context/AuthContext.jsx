import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext();

function parseJwt(token) {
  if (!token) return {};
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      username: payload.sub || payload.username || '',
      role: payload.role || '',
    };
  } catch {
    return {};
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = (jwt) => setToken(jwt);
  const logout = () => setToken(null);
  const isAuthenticated = !!token;

  const { username, role } = useMemo(() => parseJwt(token), [token]);

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated, username, role }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 