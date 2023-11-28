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
const mockUseState = (initState) => [initState, jest.fn()];

describe("Login Component", () => {
  it("로그인 버튼 클릭 시 리다이렉션 및 로딩 상태 확인", () => {
    useNavigate.mockReturnValue(mockNavigate);
    useTranslation.mockReturnValue(mockTranslation());

    delete window.location;
    window.location = { href: "" };

    const setState = jest.fn();
    const spy = jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, setState])
      .mockImplementationOnce((initState) => [initState, setState]);

    render(<Login />);

    const loginButton = screen.getByText(translationKo.login.login);
    fireEvent.click(loginButton);

    expect(setState).toHaveBeenCalledWith(true);
    expect(window.location.href).toBe(`${API_URL}/auth/login`);

    spy.mockRestore(); // 감시된 함수 복구
  });

  it("컴포넌트 초기 렌더링 시, 로그인 쿠키가 없는 경우 로그인 화면 렌더링", () => {
    useNavigate.mockReturnValue(mockNavigate);
    useTranslation.mockReturnValue(mockTranslation());
    getCookie.mockReturnValue(null);

    const setState = jest.fn();
    const spy = jest
      .spyOn(React, "useState")
      .mockImplementationOnce((initState) => [initState, setState])
      .mockImplementationOnce((initState) => [initState, setState]);

    render(<Login />);

    expect(setState).toHaveBeenCalledWith(true);

    spy.mockRestore();
  });

  it("컴포넌트 초기 렌더링 시, 로그인 쿠키가 있는 경우 navigate 함수 호출 확인", () => {
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

    const greeting1Text = screen.getByText(translationKo.login.greeting1);
    const greeting2Text = screen.getByText(translationKo.login.greeting2);
    const loginText = screen.getByText(translationKo.login.login);

    expect(greeting1Text).toBeInTheDocument();
    expect(greeting2Text).toBeInTheDocument();
    expect(loginText).toBeInTheDocument();
  });

  it("로딩 중일 때 스피너 렌더링 확인", () => {
    useNavigate.mockReturnValue(mockNavigate);
    useTranslation.mockReturnValue(mockTranslation());
    getCookie.mockReturnValue(sampleCookie);

    const setState = jest.fn();
    const spy = jest
      .spyOn(React, "useState")
      .mockImplementationOnce((initState) => [initState, setState])
      .mockImplementationOnce(() => [true, setState]);

    render(<Login />);

    const spinnerElement = screen.getByTestId("loader");
    expect(spinnerElement).toBeInTheDocument();

    spy.mockRestore();
  });

  it("버그 제보하기와 문의하기 링크 확인", () => {
    useNavigate.mockReturnValue(mockNavigate);
    useTranslation.mockReturnValue(mockTranslation());
    getCookie.mockReturnValue(null);

    const setState = jest.fn();
    const spy = jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [true, setState])
      .mockImplementationOnce((initState) => [initState, setState]);

    render(<Login />);

    const bugReportLink = screen.getByText("버그 제보하기");
    const contactLink = screen.getByText("문의하기");

    // window.open 함수는 jest에서 직접적으로 mocking 하기가 어려울 수 있음
    expect(bugReportLink).toHaveAttribute(
      "href",
      "https://github.com/42HelloWorld/42HW_Front/issues/new"
    );
    expect(bugReportLink).toHaveAttribute("target", "_blank");
    expect(contactLink).toHaveAttribute(
      "href",
      "mailto:chanhyle@student.42seoul.kr"
    );

    spy.mockRestore();
  });
});
