import React, { createContext, useContext } from "react";
import { db } from "../firebase/firebase";

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ db }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
