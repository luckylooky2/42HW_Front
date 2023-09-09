import { render, screen } from "@testing-library/react";
import Login from "@pages/Login";

describe("Login Component", () => {
  test("renders without errors", () => {
    render(<Login />);

    // 특정 요소를 검사하여 렌더링이 정상적으로 되었는지 확인
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
