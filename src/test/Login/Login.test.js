import { render, screen, fireEvent } from "@testing-library/react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { translationKo } from "locale";
import { useTranslation } from "react-i18next";
import { getCookie } from "@utils/manageCookie";
import Login from "@pages/Login";
import { API_URL } from "@utils/constant";

// 실제 라우팅 동작 대신 모의(mock) 함수인 jest.fn()을 반환하도록 설정
jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

jest.mock("utils/manageCookie", () => ({
  getCookie: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useState: jest.fn(),
}));

const mockNavigate = jest.fn();
// 테스트 환경에서는 i18next instance가 없어서 t()를 실행하지 못함 => mocking
const mockTranslation = () => ({
  t: (key) => {
    if (key === "greeting1") return translationKo.login.greeting1;
    else if (key === "greeting2") return translationKo.login.greeting2;
    else if (key === "login") return translationKo.login.login;
  },
});
const sampleCookie = "2yea8f3dzsof43";
const mockUseState = (initValue) => [initValue, jest.fn()];

describe("Login Component", () => {
  it("로그인 버튼 클릭 시 리다이렉션 및 로딩 상태 확인", () => {
    useNavigate.mockReturnValue(mockNavigate);
    useTranslation.mockReturnValue(mockTranslation());
    useState.mockReturnValueOnce(mockUseState(true));

    delete window.location;
    window.location = { href: "" };

    const setState = jest.fn();
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce((initState) => [initState, setState]);

    render(<Login />);

    fireEvent.click(screen.getByText(translationKo.login.login));

    expect(setState).toHaveBeenCalledWith(true);
    expect(window.location.href).toBe(`${API_URL}/auth/login`);
  });

  it("컴포넌트 초기 렌더링 시 로그인 상태 확인", () => {});

  it("쿠키가 있는 경우 navigate 함수 호출 확인", () => {
    useNavigate.mockReturnValue(mockNavigate);
    useTranslation.mockReturnValue(mockTranslation());
    getCookie.mockReturnValue(sampleCookie);
    useState.mockReturnValue(mockUseState(false));

    render(<Login />);

    expect(mockNavigate).toHaveBeenCalledWith("/main");
  });

  it("컴포넌트 내 텍스트 렌더링 확인", () => {
    useNavigate.mockReturnValue(mockNavigate);
    useTranslation.mockReturnValue(mockTranslation());
    useState
      .mockReturnValueOnce(mockUseState(true))
      .mockReturnValueOnce(mockUseState(false));

    render(<Login />);

    expect(screen.getByText(translationKo.login.greeting1)).toBeInTheDocument();
    expect(screen.getByText(translationKo.login.greeting2)).toBeInTheDocument();
    expect(screen.getByText(translationKo.login.login)).toBeInTheDocument();
  });

  it("로딩 중일 때 스피너 렌더링 확인", () => {});
  it("버그 제보하기와 문의하기 링크 확인", () => {});
});
