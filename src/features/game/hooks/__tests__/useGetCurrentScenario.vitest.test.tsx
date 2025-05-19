import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { useGetCurrentScenario } from '../useGetCurrentScenario'; // Adjust path as necessary
import { axiosInstance } from '@/lib/axios-config';

// Assuming a type for your scenario data, adjust as needed
interface ScenarioData {
  id: string;
  name: string;
  currentChapter: number;
  // ... other properties
}

// Mock axiosInstance
vi.mock('@/lib/axios-config', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const mockAxiosGet = axiosInstance.get as ReturnType<typeof vi.fn>;

describe('useGetCurrentScenario Hook with Vitest', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          // --- Add these options ---
          staleTime: Infinity,      // Prevent queries from becoming stale during the test
          refetchOnMount: false,    // Prevent refetch on mount
          refetchOnWindowFocus: false, // Prevent refetch on window focus
          refetchOnReconnect: false, // Prevent refetch on reconnect
          // gcTime: Infinity,      // Optional: prevent garbage collection if needed for longer tests
        },
      },
    });
    mockAxiosGet.mockReset();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should return current scenario data on successful fetch', async () => {
    const mockScenario: ScenarioData = {
      id: 'scenario123',
      name: 'The Dragon\'s Lair',
      currentChapter: 1,
    };
    // The API returns an array with one item
    mockAxiosGet.mockResolvedValueOnce({ data: [mockScenario] });

    const { result } = renderHook(() => useGetCurrentScenario(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosGet).toHaveBeenCalledWith('/api/scenario/in-progress');
    expect(result.current.data).toEqual(mockScenario); // Expecting the first item from the array
    expect(result.current.error).toBeNull();
  });

  it('should return an error on failed fetch', async () => {
    const mockError = new Error('Network Error');
    mockAxiosGet.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGetCurrentScenario(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockAxiosGet).toHaveBeenCalledWith('/api/scenario/in-progress');
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });
});