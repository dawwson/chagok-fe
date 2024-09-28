import { createContext, useContext, useEffect, useState } from "react";

interface Context {
  currentUser: User | null;
  authenticate: (user: User) => void;
  deauthenticate: () => void;
}

const AuthContext = createContext<Context>({
  currentUser: null,
  authenticate: () => {},
  deauthenticate: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface Props {
  children: React.ReactNode;
}

interface User {
  id: string;
  nickname: string;
}

const STORED_USER_KEY = "currentUser";

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const authenticate = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(STORED_USER_KEY, JSON.stringify(user));
  };

  const deauthenticate = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORED_USER_KEY);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem(STORED_USER_KEY);

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser)); // 초기화 시 로컬 스토리지에서 사용자 정보 설정
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, authenticate, deauthenticate }}>
      {children}
    </AuthContext.Provider>
  );
};
