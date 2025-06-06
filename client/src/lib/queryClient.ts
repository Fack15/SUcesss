import { QueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Default fetcher function
const defaultQueryFn = async ({ queryKey }: { queryKey: readonly any[] }) => {
  const url = Array.isArray(queryKey) ? queryKey.join('') : queryKey;
  const token = localStorage.getItem('supabase.auth.token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// API request function for mutations
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = localStorage.getItem('supabase.auth.token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        if (error?.message?.includes('401') || error?.message?.includes('403')) {
          return false; // Don't retry auth errors
        }
        return failureCount < 3;
      },
    },
  },
});