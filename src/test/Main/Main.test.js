import "../common/mocks";
import React, { useEffect, useContext, useCallback } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "react-router";
import { translationKo } from "locale";
import { useTranslation } from "react-i18next";
import axios from "axios";
import Main from "@pages/Main";

const mockNavigate = jest.fn();
const mockT = {
  t: (key) => {
    if (key === "greeting1") return translationKo.login.greeting1;
    else if (key === "greeting2") return translationKo.login.greeting2;
    else if (key === "login") return translationKo.login.login;
  },
};
const mockAuthContext = {
  myInfo: null,
  setMyInfo: jest.fn(),
  isLoading: true,
  setIsLoading: jest.fn(),
};

const mockSocketContext = {
  socket: null,
  setSocket: jest.fn(),
};

const mockCallContext = {
  dispatch: jest.fn(),
};

const getUserValue = {
  data: {
    id: 0,
    nickname: "string",
    email: "string",
    avatar: "string",
    campus: "string",
    level: 0,
    preferredLang: ["string"],
    callhistory: ["string"],
  },
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Main Component", () => {
  it("useContext 초기화 및 초기 Loading 컴포넌트 렌더링 확인", () => {
    useNavigate.mockReturnValue(mockNavigate);
    useTranslation.mockReturnValue(mockT);
    axios.get.mockReturnValue(getUserValue);

    const spy = jest
      .spyOn(React, "useContext")
      .mockReturnValueOnce(mockAuthContext)
      .mockReturnValueOnce(mockSocketContext)
      .mockReturnValueOnce(mockCallContext);

    render(<Main />);

    // TODO : dot notaion으로 state 값으로 확인하기
    expect(spy).nthReturnedWith(1, mockAuthContext);
    expect(spy).nthReturnedWith(2, mockSocketContext);
    expect(spy).nthReturnedWith(3, mockCallContext);
    const spinnerElement = screen.getByTestId("loader");
    expect(spinnerElement).toBeInTheDocument();
  });

  // it("프로필 페이지 이동", () => {});
  //   it("1:1 채팅 참여", () => {});
  //   it("그룹 채팅 참여", () => {});
  //   it("소켓 연결 확인", () => {});
  //   it("사용자 정보 불러오기", () => {});
  //   it("로딩 상태 확인", () => {});
  //   it("axios 오류 상태 확인", () => {});
  //   it("데이터가 없는 경우 렌더링", () => {});
});
