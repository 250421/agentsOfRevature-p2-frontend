import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { useAuth } from '../use-auth'; // Adjust path as necessary
import { axiosInstance } from '@/lib/axios-config';
import { setState } from '@/store'; // Adjust path as necessary
import { type Auth } from '../../models/auth';

// Mock axiosInstance
vi.mock('@/lib/axios-config', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

// Mock setState from Zustand store
vi.mock('@/store', () => ({
  setState: vi.fn(),
}));

const mockAxiosGet = axiosInstance.get as ReturnType<typeof vi.fn>;
const mockSetState = setState as ReturnType<typeof vi.fn>;

describe('useAuth Hook with Vitest', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Create a new QueryClient for each test to ensure isolation
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // Disable retries for testing to make tests faster
        },
      },
    });
    // Reset mocks before each test
    mockAxiosGet.mockReset();
    mockSetState.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore all spies
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should set loggedIn to true and return auth data on successful fetch', async () => {
    const mockAuthData: Auth = {
      id:  123,
      username: 'testuser',
      role: 'user',
    };
    mockAxiosGet.mockResolvedValueOnce({ data: mockAuthData });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for the query to settle
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosGet).toHaveBeenCalledWith('/auth/me');
    expect(result.current.data).toEqual(mockAuthData);
    expect(mockSetState).toHaveBeenCalledWith({
      loggedIn: true,
      username: mockAuthData.username,
    });
  });

  it('should set loggedIn to false and return null on failed fetch', async () => {
    const mockError = new Error('Network Error');
    mockAxiosGet.mockRejectedValueOnce(mockError);

    // Spy on console.error to ensure it's called
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for the error to be populated, which implies isError should also be true
    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    expect(mockAxiosGet).toHaveBeenCalledWith('/auth/me');
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
    expect(mockSetState).toHaveBeenCalledWith({
      loggedIn: false,
      username: '',
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
  });
});