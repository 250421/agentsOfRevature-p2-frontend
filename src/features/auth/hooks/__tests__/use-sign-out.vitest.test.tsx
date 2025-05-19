import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { AxiosError } from 'axios';
import { useSignOut } from '../use-sign-out'; 
import { axiosInstance } from '@/lib/axios-config';
import { setState } from '@/store'; 
import { toast } from 'sonner'; 
import { useNavigate } from '@tanstack/react-router';

// Mock axiosInstance
vi.mock('@/lib/axios-config', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

// Mock setState from Zustand store
vi.mock('@/store', () => ({
  setState: vi.fn(),
}));

// Mock sonner's toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock useNavigate from TanStack Router
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', async (importOriginal) => {
    const original = await importOriginal<typeof import('@tanstack/react-router')>()
    return {
        ...original,
        useNavigate: () => mockNavigate,
    }
});

const mockAxiosPost = axiosInstance.post as ReturnType<typeof vi.fn>;
const mockSetState = setState as ReturnType<typeof vi.fn>;
const mockToastSuccess = toast.success as ReturnType<typeof vi.fn>;
const mockToastError = toast.error as ReturnType<typeof vi.fn>;

describe('useSignOut Hook with Vitest', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    // Spy on queryClient.resetQueries
    vi.spyOn(queryClient, 'resetQueries');

    mockAxiosPost.mockReset();
    mockSetState.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
    mockNavigate.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should call API, reset queries, set state, show success toast, and navigate on successful sign-out', async () => {
    const mockResponseData = { message: 'Logout successful' };
    mockAxiosPost.mockResolvedValueOnce({ data: mockResponseData });

    const { result } = renderHook(() => useSignOut(), { wrapper });
    result.current.mutate(); // No arguments needed for sign-out

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosPost).toHaveBeenCalledWith('/auth/logout');
    expect(queryClient.resetQueries).toHaveBeenCalledWith({ queryKey: ["auth"] });
    expect(mockSetState).toHaveBeenCalledWith({ loggedIn: false, username: '' });
    expect(mockToastSuccess).toHaveBeenCalledWith('Logged out successfully');
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/sign-in" });
    expect(result.current.data).toEqual(mockResponseData);
  });

  it('should show error toast and log error on failed sign-out (AxiosError)', async () => {
    const errorMessage = 'Logout failed';
    const mockAxiosError = new AxiosError(
      'Request failed', '500', undefined, undefined,
      { data: { message: errorMessage }, status: 500, statusText: 'Server Error', headers: {}, config: {} as any }
    );
    mockAxiosPost.mockRejectedValueOnce(mockAxiosError);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useSignOut(), { wrapper });
    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockAxiosError);
    expect(mockSetState).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});