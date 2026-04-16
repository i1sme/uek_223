/** Handles all HTTP communication with the backend, including JWT injection */
export class ApiClient {
  private static readonly BASE_URL = "/api";

  /** Reads the JWT from localStorage */
  private static getToken(): string | null {
    return localStorage.getItem("token");
  }

  /** Builds request headers, injecting Authorization if a token is present */
  private static buildHeaders(extra?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...extra,
    };

    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /** Generic fetch wrapper — throws on non-2xx responses */
  private static async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const response = await fetch(`${this.BASE_URL}${path}`, {
      method,
      headers: this.buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error((data as { message?: string }).message ?? `HTTP ${response.status}`);
    }

    // 204 No Content
    if (response.status === 204) return undefined as unknown as T;

    return response.json() as Promise<T>;
  }

  public static get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  public static post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  public static put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("PUT", path, body);
  }

  public static delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }
}
