import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

class ApiClient {
  private readonly client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokenFromCookie();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: any) => {
        // Always check for the latest token from cookies before making a request
        if (typeof window !== 'undefined') {
          const currentToken = Cookies.get('token');
          if (currentToken && currentToken !== this.token) {
            this.token = currentToken;
          }
        }
        
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
          console.log('🔑 Sending request with token:', this.token.substring(0, 20) + '...');
        } else {
          console.log('❌ No token available for request to:', config.url);
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(new Error(error.message));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        // Only redirect to login if it's actually an authentication error
        // and not just a missing endpoint or server error
        if (error.response?.status === 401) {
          const errorMessage = (error.response?.data as any)?.message || '';
          
          // Only logout and redirect if it's a token-related authentication error
          if (errorMessage.includes('token') || errorMessage.includes('Access denied')) {
            this.clearToken();
            if (typeof window !== 'undefined') {
              // Only redirect to login if we're not already on a login page
              const currentPath = window.location.pathname;
              if (!currentPath.includes('/login')) {
                window.location.href = '/login';
              }
            }
          }
        }

        const message = (error.response?.data as any)?.message || 'An error occurred';
        
        // Don't show toast errors for authentication checks during page load
        if (typeof window !== 'undefined' && error.response?.status !== 401) {
          toast.error(message);
        }

        return Promise.reject(new Error(message));
      }
    );
  }

  private loadTokenFromCookie() {
    if (typeof window !== 'undefined') {
      this.token = Cookies.get('token') || null;
    }
  }

  public setToken(token: string) {
    this.token = token;
    Cookies.set('token', token, { expires: 7 }); // 7 days
    // Ensure the token is immediately available for next requests
    this.loadTokenFromCookie();
  }

  public clearToken() {
    this.token = null;
    Cookies.remove('token');
  }

  public getToken(): string | null {
    return this.token;
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  public async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  public async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  public async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
