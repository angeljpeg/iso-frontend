import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  AuthError,
} from "../types/auth";

const API_BASE_URL = "http://localhost:3000";

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error: AuthError = await response.json();
      throw new Error(error.message || "Error en la solicitud");
    }

    return response.json();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>("/usuarios/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    return this.makeRequest<RefreshTokenResponse>("/usuarios/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }
}

export const authService = new AuthService();
