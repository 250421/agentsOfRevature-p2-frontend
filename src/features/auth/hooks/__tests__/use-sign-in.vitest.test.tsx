import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { AxiosError } from 'axios';
import { useSignIn } from '../use-sign-in'; // Adjust path as necessary
import { axiosInstance } from '@/lib/axios-config';
import { setState } from '@/store'; // Adjust path as necessary
import { toast } from 'sonner'; // Adjust path as necessary
import { type SignInSchemaType } from '../../schemas/sign-in-schema';

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

describe('useSignIn Hook with Vitest', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
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

  const signInCredentials: SignInSchemaType = {
    username: 'testuser',
    password: 'password123',
  };

  it('should call API, set state, show success toast, and navigate on successful sign-in', async () => {
    const mockResponseData = { message: 'Login successful' };
    mockAxiosPost.mockResolvedValueOnce({ data: mockResponseData });

    const { result } = renderHook(() => useSignIn(), { wrapper });
    result.current.mutate(signInCredentials);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosPost).toHaveBeenCalledWith('/auth/login', signInCredentials);
    expect(mockSetState).toHaveBeenCalledWith({ loggedIn: true, username: '' });
    expect(mockToastSuccess).toHaveBeenCalledWith('User logged in');
    expect(mockNavigate).toHaveBeenCalledWith({ to: '/' });
    expect(result.current.data).toEqual(mockResponseData);
  });

  it('should show error toast and log error on failed sign-in (AxiosError)', async () => {
    const errorMessage = 'Invalid credentials';
    const mockAxiosError = new AxiosError(
      'Request failed',
      '401',
      undefined,
      undefined,
      { data: { message: errorMessage }, status: 401, statusText: 'Unauthorized', headers: {}, config: {} as any }
    );
    mockAxiosPost.mockRejectedValueOnce(mockAxiosError);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useSignIn(), { wrapper });
    result.current.mutate(signInCredentials);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockAxiosError);
    expect(mockSetState).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});