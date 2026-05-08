export type User = {
  id: string;
  name: string;
  email: string;
};

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextData extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
