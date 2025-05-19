import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import type { ReactNode } from 'react';
import { AxiosError } from 'axios';
import { useOptionSelected } from '../useOptionSelected'; // Adjust path as necessary
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
    patch: vi.fn(),
  },
}));

const mockAxiosPatch = axiosInstance.patch as ReturnType<typeof vi.fn>;

describe('useOptionSelected Hook with Vitest', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    // Spy on queryClient.setQueryData
    vi.spyOn(queryClient, 'setQueryData');

    mockAxiosPatch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mutationParams = {
    scenarioId: 'scenario123',
    selectedOptionId: 'optionABC',
  };

  it('should call API with correct payload and update query cache on successful option selection', async () => {
    const mockUpdatedScenario: ScenarioData = {
      id: 'scenario123',
      name: 'The Dragon\'s Lair - Chapter 2',
      currentChapter: 2,
    };
    mockAxiosPatch.mockResolvedValueOnce({ data: mockUpdatedScenario });

    const { result } = renderHook(() => useOptionSelected(), { wrapper });
    result.current.mutate(mutationParams);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosPatch).toHaveBeenCalledWith(
      `/api/scenario/${mutationParams.scenarioId}`,
      { selectedOptionId: mutationParams.selectedOptionId }
    );
    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      ['currentScenario'],
      mockUpdatedScenario
    );
    expect(result.current.data).toEqual(mockUpdatedScenario);
  });

  it('should handle API error gracefully', async () => {
    const errorMessage = 'Invalid option selected';
    const mockAxiosError = new AxiosError(
      'Request failed', '400', undefined, undefined,
      { data: { message: errorMessage }, status: 400, statusText: 'Bad Request', headers: {}, config: {} as any }
    );
    mockAxiosPatch.mockRejectedValueOnce(mockAxiosError);
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); // Assuming the hook might log errors

    const { result } = renderHook(() => useOptionSelected(), { wrapper });
    result.current.mutate(mutationParams);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(mockAxiosPatch).toHaveBeenCalledWith(
      `/api/scenario/${mutationParams.scenarioId}`,
      { selectedOptionId: mutationParams.selectedOptionId }
    );
    expect(queryClient.setQueryData).not.toHaveBeenCalled();
    expect(result.current.error).toEqual(mockAxiosError);
    // if your hook logs the error, you can assert that:
    // expect(consoleErrorSpy).toHaveBeenCalledWith(mockAxiosError);
    consoleErrorSpy.mockRestore(); // Restore if you spied
  });
});