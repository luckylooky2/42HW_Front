import React from "react";
import { render } from "@testing-library/react";
import { useNavigate } from "react-router";
import qs from "query-string";
import Redirect from "@pages/Redirect";

// 1. 실제 라우팅 동작 대신 모의(Mock) 함수인 jest.fn()을 반환하도록 설정
jest.mock("react-router", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("query-string", () => ({
  parse: jest.fn(),
}));

describe("Redirect component", () => {
  it("should navigate to /main when params are present", () => {
    // 모의(Mock) 함수 설정
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // 모의(Mock)된 window.location.search 설정
    const params = { token: "mockToken" };
    qs.parse.mockReturnValue(params);

    // 컴포넌트 렌더링
    render(<Redirect />);

    // navigate 함수가 호출되었는지 확인
    expect(mockNavigate).toHaveBeenCalledWith("/main");
  });

  it("should navigate to /login when params are not present", () => {
    // 모의(Mock) 함수 설정
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    // 모의(Mock)된 window.location.search 설정
    qs.parse.mockReturnValue({});

    // 컴포넌트 렌더링
    render(<Redirect />);

    // navigate 함수가 호출되었는지 확인
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
