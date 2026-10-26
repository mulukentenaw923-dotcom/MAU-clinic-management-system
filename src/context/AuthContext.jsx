import { createContext, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children, value = null }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
