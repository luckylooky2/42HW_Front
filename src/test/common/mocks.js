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
  useContext: jest.fn(),
}));

jest.mock("axios", () => ({
  get: jest.fn(),
}));
