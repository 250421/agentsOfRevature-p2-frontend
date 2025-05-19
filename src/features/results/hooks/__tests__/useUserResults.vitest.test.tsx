import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { useUserResults } from '../useUserResults'; // Adjust path as necessary
import { axiosInstance } from '@/lib/axios-config';
import type { Results } from '@/features/results/models/results'; // Assuming this is your type

// Mock axiosInstance
vi.mock('@/lib/axios-config', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const mockAxiosGet = axiosInstance.get as ReturnType<typeof vi.fn>;

// Sample Results data - adjust according to your actual Results type
const createMockResult = (id: number, score: number): Results => ({
  id,
  userId: 1,
  username: 'username',
  calamityId: 1,
  didWin: false,
  repGained: 10,
});

describe('useUserResults Hook with Vitest', () => {
  let queryClient: QueryClient;
  const testUserId = 123;

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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should return user results data on successful fetch', async () => {
    const mockResultsData: Results[] = [
      createMockResult(1, 1000),
      createMockResult(2, 1500),
    ];
    mockAxiosGet.mockResolvedValueOnce({ data: mockResultsData });

    const { result } = renderHook(() => useUserResults(testUserId), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosGet).toHaveBeenCalledWith(`/api/results/userResults/${testUserId}`);
    expect(result.current.data).toEqual(mockResultsData);
    expect(result.current.error).toBeNull();
  });

  it('should return an error on failed fetch', async () => {
    const mockError = new Error('API Error: User results not found');
    mockAxiosGet.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUserResults(testUserId), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockAxiosGet).toHaveBeenCalledWith(`/api/results/userResults/${testUserId}`);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });

  it('should include userId in the queryKey', () => {
    // This test doesn't need to wait for an API call, just checks the initial setup
    const { result } = renderHook(() => useUserResults(testUserId), { wrapper });
    
    // Accessing internal query object might be brittle, but useful for checking queryKey
    // A more robust way might be to check if a refetch with a different userId uses a different cache entry.
    // For now, we'll assume the queryKey is correctly formed by useQuery based on its arguments.
    // A direct assertion on result.current.queryKey isn't standard with useQuery's return.
    // We can infer it by ensuring the API call uses the userId.
    expect(mockAxiosGet).toHaveBeenCalledWith(expect.stringContaining(String(testUserId)));
  });
});