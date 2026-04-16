import { ApiClient } from "../api/ApiClient";

export interface AuthUser {
  id: string;
  username: string;
  role: "user" | "moderator" | "admin";
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

/** Manages authentication state and auth-related API calls */
export class AuthService {
  private static readonly TOKEN_KEY = "token";
  private static readonly USER_KEY = "auth_user";

  public static async register(
    username: string,
    password: string
  ): Promise<void> {
    const data = await ApiClient.post<AuthResponse>("/auth/register", {
      username,
      password,
    });
    this.storeSession(data);
  }

  public static async login(
    username: string,
    password: string
  ): Promise<void> {
    const data = await ApiClient.post<AuthResponse>("/auth/login", {
      username,
      password,
    });
    this.storeSession(data);
  }

  public static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  public static isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  public static getCurrentUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  }

  /** Updates the stored user data (e.g. after a profile update) */
  public static updateStoredUser(partial: Partial<AuthUser>): void {
    const current = this.getCurrentUser();
    if (!current) return;
    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify({ ...current, ...partial })
    );
  }

  private static storeSession(data: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, data.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));
  }
}
