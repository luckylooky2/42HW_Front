import { IUser } from "@typings/db";
import React, { createContext, FC, useMemo, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const AuthContext = createContext<{
  myInfo: IUser | null;
  setMyInfo: React.Dispatch<React.SetStateAction<IUser | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  myInfo: null,
  setMyInfo: () => {},
  isLoading: true,
  setIsLoading: () => {},
});

const AuthProvider: FC<Props> = ({ children }) => {
  // useState를 사용하면, context를 자식 컴포넌트에서도 업데이트할 수 있음
  const [myInfo, setMyInfo] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const value = useMemo(
    () => ({ myInfo, setMyInfo, isLoading, setIsLoading }),
    [myInfo, setMyInfo, isLoading, setIsLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
