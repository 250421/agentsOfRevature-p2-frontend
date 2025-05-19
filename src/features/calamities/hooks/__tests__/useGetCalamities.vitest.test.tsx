import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { useGetCalamities } from '../useGetCalamities'; // Adjust path as necessary
import { axiosInstance } from '@/lib/axios-config';
import type { Calamity } from '../../models/calamity'; // Assuming you have this type

// Mock axiosInstance
vi.mock('@/lib/axios-config', () => ({
  axiosInstance: {
    get: vi.fn(),
  },
}));

const mockAxiosGet = axiosInstance.get as ReturnType<typeof vi.fn>;

const createMockCalamity = (id: number, title: string): Calamity => ({
  id,
  title,
  location: `Location ${id}`,
  severity: 'MEDIUM',
  description: `Description for ${title}`,
  reported: new Date().toISOString(),
});

describe('useGetCalamities Hook with Vitest', () => {
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should return calamities data on successful fetch', async () => {
    const mockCalamitiesData: Calamity[] = [
      createMockCalamity(1, 'Flood'),
      createMockCalamity(2, 'Earthquake'),
    ];
    mockAxiosGet.mockResolvedValueOnce({ data: mockCalamitiesData });

    const { result } = renderHook(() => useGetCalamities(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosGet).toHaveBeenCalledWith('/api/calamity');
    expect(result.current.data).toEqual(mockCalamitiesData);
    expect(result.current.error).toBeNull();
  });

  it('should return an error on failed fetch', async () => {
    const mockError = new Error('Network Error');
    mockAxiosGet.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useGetCalamities({ retry: 0 }), { wrapper });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
    
    expect(mockAxiosGet).toHaveBeenCalledWith('/api/calamity');
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });
});