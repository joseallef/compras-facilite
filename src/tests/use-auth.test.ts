// Mock de next-auth/react antes de tudo
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@/features/auth/services/auth-service", () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
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

import * as auth from "@/features/auth/hooks/use-auth";
import * as services from "@/features/auth/services/auth-service";
import { act, renderHook } from "@testing-library/react";
import * as nextAuth from "next-auth/react";
import * as navigation from "next/navigation";
import * as sonner from "sonner";

const mockedNextAuth = nextAuth as jest.Mocked<typeof nextAuth>;
const mockedServices = services as jest.Mocked<typeof services>;
const mockedNavigation = navigation as jest.Mocked<typeof navigation>;
const mockedSonner = sonner as jest.Mocked<typeof sonner>;

const mockUser = { id: "user-1", email: "test@example.com", name: "Test User" };

describe("useAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup padrão para os mocks
    mockedNavigation.usePathname.mockReturnValue("/");
    mockedNavigation.useRouter.mockReturnValue({
      replace: jest.fn(),
      push: jest.fn(),
    } as any);
    mockedNavigation.useSearchParams.mockReturnValue({
      get: jest.fn(),
    } as any);
  });

  it("should return null user when not authenticated", () => {
    mockedNextAuth.useSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as any);

    const { result } = renderHook(() => auth.useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it("should return user when authenticated", () => {
    mockedNextAuth.useSession.mockReturnValue({
      data: { user: mockUser },
      status: "authenticated",
    } as any);

    const { result } = renderHook(() => auth.useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it("should be loading when status is loading", () => {
    mockedNextAuth.useSession.mockReturnValue({
      data: null,
      status: "loading",
    } as any);

    const { result } = renderHook(() => auth.useAuth());

    expect(result.current.isLoading).toBe(true);
  });

  it("should call login service on login", async () => {
    mockedNextAuth.useSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    } as any);
    mockedServices.authService.login.mockResolvedValue(undefined);

    const { result } = renderHook(() => auth.useAuth());

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(mockedServices.authService.login).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("should call logout service on logout", async () => {
    mockedNextAuth.useSession.mockReturnValue({
      data: { user: mockUser },
      status: "authenticated",
    } as any);
    mockedServices.authService.logout.mockResolvedValue(undefined);

    const { result } = renderHook(() => auth.useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockedServices.authService.logout).toHaveBeenCalled();
  });

  it("should set manualLogoutInProgress when logout is called", async () => {
    mockedNextAuth.useSession.mockReturnValue({
      data: { user: mockUser },
      status: "authenticated",
    } as any);
    mockedServices.authService.logout.mockResolvedValue(undefined);

    const { result } = renderHook(() => auth.useAuth());

    await act(async () => {
      await result.current.logout();
    });
  });
});
