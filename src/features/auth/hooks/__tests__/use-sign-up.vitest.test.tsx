import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { AxiosError } from 'axios';
import { useSignUp } from '../use-sign-up'; // Adjust path as necessary
import { axiosInstance } from '@/lib/axios-config';
import { toast } from 'sonner'; // Adjust path as necessary
import { type SignupSchemaType } from '../../schemas/sign-up-schema';

// Mock axiosInstance
vi.mock('@/lib/axios-config', () => ({
  axiosInstance: {
    post: vi.fn(),
  },
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
const mockToastSuccess = toast.success as ReturnType<typeof vi.fn>;
const mockToastError = toast.error as ReturnType<typeof vi.fn>;

describe('useSignUp Hook with Vitest', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    mockAxiosPost.mockReset();
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

  const signUpCredentials: SignupSchemaType = {
    username: 'newuser',
    email: 'newuser@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  it('should call API, show success toast, and navigate on successful sign-up', async () => {
    const mockResponseData = { message: 'User created successfully' };
    mockAxiosPost.mockResolvedValueOnce({ data: mockResponseData });

    const { result } = renderHook(() => useSignUp(), { wrapper });
    result.current.mutate(signUpCredentials);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosPost).toHaveBeenCalledWith('auth/signup', signUpCredentials);
    expect(mockToastSuccess).toHaveBeenCalledWith('User created');
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/sign-in" });
    expect(result.current.data).toEqual(mockResponseData);
  });

  it('should show error toast and log error on failed sign-up (AxiosError)', async () => {
    const errorMessage = 'Username already exists';
    const mockAxiosError = new AxiosError(
      'Request failed', '409', undefined, undefined,
      { data: { message: errorMessage }, status: 409, statusText: 'Conflict', headers: {}, config: {} as any }
    );
    mockAxiosPost.mockRejectedValueOnce(mockAxiosError);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useSignUp(), { wrapper });
    result.current.mutate(signUpCredentials);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockAxiosError);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});