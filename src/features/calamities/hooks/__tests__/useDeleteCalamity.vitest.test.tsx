import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { AxiosError } from 'axios';
import { useDeleteCalamity } from '../useDeleteCalamity'; 
import { axiosInstance } from '@/lib/axios-config';
import { toast } from 'sonner'; 

// Mock axiosInstance
vi.mock('@/lib/axios-config', () => ({
  axiosInstance: {
    delete: vi.fn(),
  },
}));

// Mock sonner's toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockAxiosDelete = axiosInstance.delete as ReturnType<typeof vi.fn>;
const mockToastSuccess = toast.success as ReturnType<typeof vi.fn>;
const mockToastError = toast.error as ReturnType<typeof vi.fn>;

describe('useDeleteCalamity Hook with Vitest', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false }, // Though not directly used by this mutation, good practice
        mutations: { retry: false },
      },
    });
    // Spy on queryClient.invalidateQueries
    vi.spyOn(queryClient, 'invalidateQueries');

    mockAxiosDelete.mockReset();
    mockToastSuccess.mockReset();
    mockToastError.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const calamityIdToDelete = 123;

  it('should call API, show success toast, and invalidate queries on successful deletion', async () => {
    const mockResponseData = { message: 'Calamity deleted successfully' };
    mockAxiosDelete.mockResolvedValueOnce({ data: mockResponseData });

    const { result } = renderHook(() => useDeleteCalamity(), { wrapper });
    result.current.mutate(calamityIdToDelete);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosDelete).toHaveBeenCalledWith(`/calamities/${calamityIdToDelete}`);
    expect(mockToastSuccess).toHaveBeenCalledWith('Calamity deleted.');
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['calamities'] });
    expect(result.current.data).toEqual(mockResponseData);
  });

  it('should show error toast on failed deletion (AxiosError)', async () => {
    const errorMessage = 'Failed to delete calamity due to server error';
    const mockAxiosError = new AxiosError(
      'Request failed', 
      '500', 
      undefined, 
      undefined, 
      { data: { message: errorMessage }, status: 500, statusText: 'Internal Server Error', headers: {}, config: {} as any }
    );
    mockAxiosDelete.mockRejectedValueOnce(mockAxiosError);

    const { result } = renderHook(() => useDeleteCalamity(), { wrapper });
    result.current.mutate(calamityIdToDelete);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockAxiosDelete).toHaveBeenCalledWith(`/calamities/${calamityIdToDelete}`);
    expect(mockToastError).toHaveBeenCalledWith(errorMessage);
    expect(queryClient.invalidateQueries).not.toHaveBeenCalled(); // Should not invalidate on error
    expect(result.current.error).toEqual(mockAxiosError);
  });

  it('should not show toast if error is not an AxiosError (or if response/data/message is missing)', async () => {
    const genericError = new Error('Network connection lost');
    mockAxiosDelete.mockRejectedValueOnce(genericError);

    const { result } = renderHook(() => useDeleteCalamity(), { wrapper });
    result.current.mutate(calamityIdToDelete);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockToastError).not.toHaveBeenCalled(); // Specific AxiosError handling means this won't be called for generic errors
    expect(result.current.error).toEqual(genericError);
  });
});