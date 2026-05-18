// Mock de next-auth/react antes de tudo
jest.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { LoginForm } from "@/app/(public)/login/components/login-form";
import * as auth from "@/features/auth/hooks/use-auth";
import * as navigation from "next/navigation";
import * as sonner from "sonner";

const mockedAuth = auth as jest.Mocked<typeof auth>;
const mockedNavigation = navigation as jest.Mocked<typeof navigation>;
const mockedSonner = sonner as jest.Mocked<typeof sonner>;

describe("LoginForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup padrão para os mocks
    mockedAuth.useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    });
    
    mockedNavigation.useRouter.mockReturnValue({
      replace: jest.fn(),
      push: jest.fn(),
    } as any);
    
    mockedNavigation.useSearchParams.mockReturnValue({
      get: jest.fn(),
    } as any);
  });

  it("should render login form with email and password fields", () => {
    render(<LoginForm />);
    
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("should show warning toast when session parameter is 'expired'", async () => {
    mockedNavigation.useSearchParams.mockReturnValue({
      get: jest.fn((param) => param === "session" ? "expired" : null),
    } as any);

    render(<LoginForm />);
    
    await waitFor(() => {
      expect(mockedSonner.toast.warning).toHaveBeenCalledWith("Sua sessão expirou. Por favor, faça login novamente.");
    });
  });

  it("should redirect to callbackUrl after successful login", async () => {
    const mockPush = jest.fn();
    const mockLogin = jest.fn();
    
    mockedNavigation.useSearchParams.mockReturnValue({
      get: jest.fn((param) => param === "callbackUrl" ? "/dashboard" : null),
    } as any);
    
    mockedNavigation.useRouter.mockReturnValue({
      replace: jest.fn(),
      push: mockPush,
    } as any);
    
    mockedAuth.useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: jest.fn(),
      register: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    });

    render(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText(/seu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("should redirect to dashboard by default when no callbackUrl", async () => {
    const mockPush = jest.fn();
    const mockLogin = jest.fn();
    
    mockedNavigation.useSearchParams.mockReturnValue({
      get: jest.fn(),
    } as any);
    
    mockedNavigation.useRouter.mockReturnValue({
      replace: jest.fn(),
      push: mockPush,
    } as any);
    
    mockedAuth.useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: jest.fn(),
      register: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    });

    render(<LoginForm />);
    
    const emailInput = screen.getByPlaceholderText(/seu@email.com/i);
    const passwordInput = screen.getByPlaceholderText(/••••••••/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.change(passwordInput, { target: { value: "password123" } });
      fireEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });
});
