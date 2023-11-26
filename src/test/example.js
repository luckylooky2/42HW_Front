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
    // useNavigate()가 반환하는 navigate()를 설정해주기 위해
    // 우리가 알고 싶은 것은 navigate()의 매개변수!
    useNavigate.mockReturnValue(mockNavigate);

    // 모의(Mock)된 window.location.search 설정
    const params = { token: "mockToken" };
    qs.parse.mockReturnValue(params);

    // 컴포넌트 렌더링
    render(<Redirect />);

    // useNavigate()에 주입하는 mock function과 테스트할 mock function은 동일한 인스턴스여야 함
    // 모의(Mock) 함수를 통해 useNavigate() / navigate()의 호출을 감시하고 검증하기 위한 필수적인 단계
    // 다른 인스턴스일 경우, 모의(Mock) 함수가 동작하지 않거나 테스트가 원하는 대로 작동하지 않음
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

// 테스트
// 1. 실제 코드를 실행하는 것이 아니라
// 2. 실제 코드를 가져와서(import) 필요한 부분을 모킹한 새로운 코드를 실행하여(실제 코드에 변형을 가하는 것이 아님)
// - 이 과정에서 원래 있던 의존성이 아닌 가짜 의존성을 주입하여 테스트하는 방법
// - 이로써 테스트 코드가 제어의 역전을 실현하게 됨 : 의존성 관리를 직접 제어
// - 제어의 역전
//  - 일반적으로 프로그램은 메인 함수에서 시작되며, 해당 함수가 다른 함수를 호출하며 제어 흐름을 결정
//  - 제어의 역전은 제어를 프로그램 외부로 미루는 것을 의미
//  - 특정 함수 안에서 객체를 만드는 방법도 있지만, 함수 외부에서 객체를 만들고 매개변수로 의존성을 주입받는 방법도 존재
//   - 이런 경우, 객체 간의 결합도를 낮추고 재사용성이 증가
//  - e.g.
//    - 프레임워크나 컨테이너를 사용하여 객체의 생명주기와 의존성을 관리(spring 프레임워크 의존성 주입)
//    - 이벤트 리스너(핸들러) 등록 및 관리
//    - 컴포넌트 라이프사이클 관리(react, angular)
//    - 가게 직원의 계산하는 과정을 외부 의존성으로 만드는 경우
//    - js sort 함수에서 정렬 방식을 결정하기 위해 콜백 함수를 제공하는 것
// 3. 격리된 환경에서 코드의 동작을 확인하는 프로세스

// - 실행되는 시점에 실제 코드에 내가 만든 코드를 넣는 방식으로 진행될 것이라고 생각했었음

// 테스트를 왜 하는가?
// - 1. 효율성 : 일일이 그때그때 테스트하는 것보다 시간적으로 효율적
// - 2. 코드의 유연성과 유지보수성을 높임
//  - 테스트가 가능한 코드는 외부 의존성 주입하고, 프로그램의 제어 흐름을 외부로 미룸으로써(제어의 역전) 모킹이 가능한 코드
//  - 외부 의존성 주입이라는 특징 때문에, 동적으로 변경이 가능해 유연하고 유지보수성이 높아짐
