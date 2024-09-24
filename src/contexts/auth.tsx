import { createContext, useContext, useEffect, useState } from "react";

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

const STORED_USER_KEY = "currentUser";

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const signIn = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(STORED_USER_KEY, JSON.stringify(user));
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORED_USER_KEY);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem(STORED_USER_KEY);

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user); // 초기화 시 로컬 스토리지에서 사용자 정보 설정
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
