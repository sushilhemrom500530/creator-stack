const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || localStorage.getItem('accessToken') || null;
}

export function getActiveWorkspaceId(): string {
  if (typeof window === 'undefined') return '';
  const val = localStorage.getItem('active_workspace_id') || localStorage.getItem('activeWorkspaceId') || '';
  if (val === '[object Object]' || val === 'default-workspace' || val === 'undefined' || val === 'null') {
    return '';
  }
  return val;
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
      if (value !== undefined && value !== null && value !== '' && value !== '[object Object]') {
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
    if (response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('jwt');
        document.cookie = 'auth_token=; path=/; max-age=0';
        document.cookie = 'access_token=; path=/; max-age=0';
        window.location.href = `/auth/login?expired=true&redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    }
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
  getAccounts: (workspaceId?: string) => {
    const params: Record<string, any> = {};
    if (workspaceId && workspaceId !== '[object Object]') params.workspaceId = workspaceId;
    return api.get<any[]>('/social-accounts', params);
  },

  getHealth: (workspaceId?: string) => {
    const params: Record<string, any> = {};
    if (workspaceId && workspaceId !== '[object Object]') params.workspaceId = workspaceId;
    return api.get<any>('/social-accounts/health', params);
  },

  getOAuthUrl: (platform: string, workspaceId?: string) => {
    const params: Record<string, any> = {};
    if (workspaceId && workspaceId !== '[object Object]') params.workspaceId = workspaceId;
    return api.get<{ authUrl: string; state: string; platform: string }>(
      `/social-accounts/oauth/${platform}/authorize`,
      params
    );
  },

  refreshToken: (accountId: string) =>
    api.post<any>(`/social-accounts/${accountId}/refresh`),

  updateAccount: (accountId: string, updateDto: any) =>
    api.patch<any>(`/social-accounts/${accountId}`, updateDto),

  disconnectAccount: (accountId: string) =>
    api.delete<any>(`/social-accounts/${accountId}`),
};

// Posts API Endpoints
export const postsApi = {
  createPost: (createDto: any) =>
    api.post<any>('/posts', createDto),

  getPosts: (params: { workspaceId: string; status?: string; platform?: string; search?: string; page?: number; limit?: number }) =>
    api.get<{ data: any[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/posts', params),

  getPost: (id: string) =>
    api.get<any>(`/posts/${id}`),

  getSummary: (workspaceId: string) =>
    api.get<{ total: number; drafts: number; scheduled: number; publishing: number; published: number; failed: number }>('/posts/summary', { workspaceId }),

  updatePost: (id: string, updateDto: any) =>
    api.patch<any>(`/posts/${id}`, updateDto),

  deletePost: (id: string) =>
    api.delete<any>(`/posts/${id}`),
};

// WhatsApp Messaging API Endpoints
export const whatsappApi = {
  sendText: (dto: any) => api.post<any>('/whatsapp/send-text', dto),
  sendMedia: (dto: any) => api.post<any>('/whatsapp/send-media', dto),
  sendTemplate: (dto: any) => api.post<any>('/whatsapp/send-template', dto),
  getTemplates: (workspaceId: string) => api.get<any[]>('/whatsapp/templates', { workspaceId }),
  getPhoneNumbers: (workspaceId: string) => api.get<any[]>('/whatsapp/phone-numbers', { workspaceId }),
};

// Publishing Engine API Endpoints
export const publishingApi = {
  publishNow: (postId: string) =>
    api.post<any>(`/publishing/posts/${postId}/publish-now`),

  retryTarget: (postId: string, accountId: string) =>
    api.post<any>(`/publishing/posts/${postId}/retry-target/${accountId}`),
};

// Uploads & Media Library API Endpoints
export const uploadsApi = {
  uploadCloudinary: async (file: File, workspaceId: string, folder = 'creator-stack') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);
    formData.append('folder', folder);

    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/uploads/cloudinary`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Upload failed');
    return data?.data || data;
  },

  uploadS3: async (file: File, workspaceId: string, folder = 'creator-stack') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('workspaceId', workspaceId);
    formData.append('folder', folder);

    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/uploads/s3`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Upload failed');
    return data?.data || data;
  },

  uploadMultiple: async (files: File[], workspaceId: string, provider: 'cloudinary' | 's3' = 'cloudinary', folder = 'creator-stack') => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('workspaceId', workspaceId);
    formData.append('provider', provider);
    formData.append('folder', folder);

    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/uploads/multiple`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || 'Batch upload failed');
    return data?.data || data;
  },

  getGallery: (params: { workspaceId: string; resourceType?: string; search?: string; page?: number; limit?: number }) =>
    api.get<{ data: any[]; meta: { total: number; page: number; limit: number; totalPages: number } }>('/uploads/gallery', params),

  deleteMedia: (id: string) =>
    api.delete<any>(`/uploads/${id}`),
};

// Scheduler & Worker API Endpoints
export const schedulerApi = {
  triggerDuePosts: () =>
    api.post<{ message: string; processedCount: number; timestamp: string }>('/scheduler/trigger-due-posts'),

  getStatus: () =>
    api.get<{ status: string; interval: string; tokenCheckInterval: string; timestamp: string }>('/scheduler/status'),
};

// AI Content Studio API Endpoints
export const aiApi = {
  generateCaption: (dto: { workspaceId: string; topic: string; platform?: string; tone?: string; includeHashtags?: boolean; includeEmojis?: boolean }) =>
    api.post<{ caption: string; platform: string; tone: string; tokensUsed: number; model: string }>('/ai/generate-caption', dto),

  generateHashtags: (dto: { workspaceId: string; keyword: string; count?: number }) =>
    api.post<{ raw: string; hashtags: string[]; count: number; tokensUsed: number }>('/ai/generate-hashtags', dto),

  generateHooks: (dto: { workspaceId: string; topic: string; targetAudience?: string }) =>
    api.post<{ raw: string; hooks: string[]; tokensUsed: number }>('/ai/generate-hooks', dto),

  generateThread: (dto: { workspaceId: string; topic: string; tweetsCount?: number }) =>
    api.post<{ thread: string; tweetsCount: number; tokensUsed: number }>('/ai/generate-thread', dto),

  chat: (dto: { workspaceId: string; message: string; history?: any[] }) =>
    api.post<{ message: string; tokensUsed: number; model: string }>('/ai/chat', dto),

  getUsageStats: (workspaceId: string) =>
    api.get<{ usedTokens: number; monthlyLimit: number; remainingTokens: number; percentUsed: number; totalGenerations: number; tier: string }>('/ai/usage/stats', { workspaceId }),

  getUsageHistory: (workspaceId: string, limit?: number) =>
    api.get<any[]>('/ai/usage/history', { workspaceId, limit }),
};

// Analytics API Endpoints
export const analyticsApi = {
  getOverview: (workspaceId: string, timeframe = '30d') =>
    api.get<{
      timeframe: string;
      stats: Array<{ title: string; value: string; raw: number; change: string; isPositive: boolean }>;
      platformDistribution: Array<{ platform: string; label: string; percentage: number; impressions: number; color: string }>;
      connectedAccountsCount: number;
      publishedPostsCount: number;
    }>('/analytics/overview', { workspaceId, timeframe }),

  getTrends: (workspaceId: string, days = 7) =>
    api.get<{ categories: string[]; series: Array<{ name: string; data: number[] }> }>('/analytics/trends', { workspaceId, days }),

  getGeography: (workspaceId: string) =>
    api.get<{ regions: Array<{ id: string; country: string; flag: string; percentage: number; reach: string; lat: number; lng: number }> }>('/analytics/geography', { workspaceId }),

  getSentiment: (workspaceId: string) =>
    api.get<{ overallScore: number; positive: number; neutral: number; negative: number; totalAnalyzed: number; trend: string; topThemes: Array<{ theme: string; sentiment: string }> }>('/analytics/sentiment', { workspaceId }),

  getBestTimeToPost: (workspaceId: string) =>
    api.get<{ recommendations: Array<{ platform: string; dayOfWeek: string; bestTime: string; expectedBoost: string }> }>('/analytics/best-time-to-post', { workspaceId }),
};

// Notifications & Alerts API Endpoints
export const notificationsApi = {
  getNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    api.get<{
      data: Array<{
        _id: string;
        title: string;
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
        category: 'publishing' | 'token_expiry' | 'ai' | 'security' | 'billing' | 'system';
        link?: string;
        read: boolean;
        createdAt: string;
      }>;
      meta: { total: number; page: number; limit: number; totalPages: number; unreadCount: number };
    }>('/notifications', params),

  getUnreadCount: () =>
    api.get<{ unreadCount: number }>('/notifications/unread-count'),

  markAsRead: (id: string) =>
    api.patch<{ _id: string; read: boolean }>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    api.patch<{ updatedCount: number }>('/notifications/mark-all-read'),

  deleteNotification: (id: string) =>
    api.delete<{ success: boolean }>(`/notifications/${id}`),
};

// Workspaces API Endpoints
export const workspacesApi = {
  getWorkspaces: () =>
    api.get<Array<{
      _id: string;
      name: string;
      slug: string;
      ownerId: string;
      members: Array<{ userId: { _id: string; name: string; email: string; avatar?: string } | string; role: 'owner' | 'admin' | 'editor' | 'viewer'; joinedAt: string }>;
      logo?: string;
      description?: string;
      settings?: Record<string, any>;
      createdAt: string;
    }>>('/workspaces'),

  getWorkspace: (id: string) =>
    api.get<any>(`/workspaces/${id}`),

  createWorkspace: (dto: { name: string; slug?: string; description?: string; logo?: string }) =>
    api.post<any>('/workspaces', dto),

  updateWorkspace: (id: string, dto: { name?: string; description?: string; logo?: string; settings?: Record<string, any> }) =>
    api.patch<any>(`/workspaces/${id}`, dto),

  inviteMember: (id: string, dto: { email: string; role: 'owner' | 'admin' | 'editor' | 'viewer' }) =>
    api.post<any>(`/workspaces/${id}/members`, dto),

  updateMemberRole: (id: string, memberUserId: string, role: 'owner' | 'admin' | 'editor' | 'viewer') =>
    api.patch<any>(`/workspaces/${id}/members/${memberUserId}/role`, { role }),

  removeMember: (id: string, memberUserId: string) =>
    api.delete<any>(`/workspaces/${id}/members/${memberUserId}`),

  deleteWorkspace: (id: string) =>
    api.delete<{ message: string }>(`/workspaces/${id}`),

  setActiveWorkspace: (id: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('active_workspace_id', id);
    }
  },
};

// Auth API Endpoints
export const authApi = {
  login: (dto: { email: string; password: string }) =>
    api.post<{
      user: { id: string; name: string; email: string; roles: string[]; lastLoginAt?: string };
      accessToken: string;
      refreshToken?: string;
    }>('/auth/login', dto),

  register: (dto: { name: string; email: string; password: string; country?: string }) =>
    api.post<{
      message: string;
      verificationToken: string;
      expiresAt: string;
      email: string;
    }>('/auth/register', dto),

  verifyOtp: (dto: { verificationToken: string; otp: string }) =>
    api.post<{
      message: string;
      user: { id: string; name: string; email: string; roles: string[] };
      accessToken: string;
      refreshToken?: string;
    }>('/auth/verify-otp', dto),

  resendOtp: (dto: { email: string }) =>
    api.post<{ message: string; verificationToken: string }>('/auth/resend-otp', dto),

  forgotPassword: (dto: { email: string }) =>
    api.post<{ message: string; resetToken: string }>('/auth/forgot-password', dto),

  verifyForgotOtp: (dto: { resetToken: string; otp: string }) =>
    api.post<{ message: string; verifiedToken: string }>('/auth/verify-forgot-otp', dto),

  resetPassword: (dto: { verifiedToken: string; newPassword: string }) =>
    api.post<{ message: string }>('/auth/reset-password', dto),

  logout: () =>
    api.post<{ message: string }>('/auth/logout'),
};

