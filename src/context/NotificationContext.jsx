import { createContext, useContext } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children, value = null }) {
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
