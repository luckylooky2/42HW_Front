import React, { createContext, FC, useEffect, useMemo, useState } from "react";
import { IUser } from "@typings/db";

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
  // const navigate = useNavigate();
  // useState를 사용하면, context를 자식 컴포넌트에서도 업데이트할 수 있음
  const [myInfo, setMyInfo] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const value = useMemo(
    () => ({ myInfo, setMyInfo, isLoading, setIsLoading }),
    [myInfo, setMyInfo, isLoading, setIsLoading]
  );

  // useEffect(() => {
  //   // 토큰을 가지고 나의 정보 요청
  //   // 성공 ? context에 나의 정보 저장 : status code 401 => 로그인 화면으로 이동
  //   try {
  //     const result = axios.get(`${API_URL}/user/me`);
  //     setNickname("chanhyle");
  //   } catch (e) {
  //     // redirect를 하면 무한 라우팅 발생 => 클라이언트 라우팅이 필요
  //     alert("로그인 정보가 유효하지 않습니다. 다시 로그인 해주세요.");
  //     navigate("/login");
  //   }
  // }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
