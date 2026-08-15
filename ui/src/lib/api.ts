const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('accessToken') || null;
}

export function getActiveWorkspaceId(): string {
  if (typeof window === 'undefined') return 'default-workspace';
  return localStorage.getItem('activeWorkspaceId') || 'default-workspace';
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...customConfig } = options;

  let url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customConfig.headers,
  };

  const response = await fetch(url, {
    ...customConfig,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return (data?.data !== undefined ? data.data : data) as T;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, any>) =>
    request<T>(endpoint, { method: 'GET', params }),

  post: <T>(endpoint: string, body?: any, params?: Record<string, any>) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      params,
    }),

  patch: <T>(endpoint: string, body?: any, params?: Record<string, any>) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      params,
    }),

  delete: <T>(endpoint: string, params?: Record<string, any>) =>
    request<T>(endpoint, { method: 'DELETE', params }),
};

// Social Accounts API Endpoints
export const socialAccountsApi = {
  getAccounts: (workspaceId: string) =>
    api.get<any[]>('/social-accounts', { workspaceId }),

  getHealth: (workspaceId: string) =>
    api.get<any>('/social-accounts/health', { workspaceId }),

  getOAuthUrl: (platform: string, workspaceId: string) =>
    api.get<{ authUrl: string; state: string; platform: string }>(
      `/social-accounts/oauth/${platform}/authorize`,
      { workspaceId }
    ),

  refreshToken: (accountId: string) =>
    api.post<any>(`/social-accounts/${accountId}/refresh`),

  updateAccount: (accountId: string, updateDto: any) =>
    api.patch<any>(`/social-accounts/${accountId}`, updateDto),

  disconnectAccount: (accountId: string) =>
    api.delete<any>(`/social-accounts/${accountId}`),
};

// Workspaces API Endpoints
export const workspacesApi = {
  getWorkspaces: () => api.get<any[]>('/workspaces'),
  getWorkspace: (id: string) => api.get<any>(`/workspaces/${id}`),
};
