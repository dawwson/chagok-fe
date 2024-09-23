import { createContext, useContext, useState } from "react";

interface Context {
  currentUser: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<Context>({
  currentUser: null,
  signIn: () => {},
  signOut: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface Props {
  children: React.ReactNode;
}

interface User {
  id: string;
  email: string;
}

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const signIn = (user: User) => {
    setCurrentUser(user);
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
