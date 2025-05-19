import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { usePagination } from '../usePagination'; // Adjust path as necessary

interface TestItem {
  id: number;
  name: string;
}

const createMockItems = (count: number): TestItem[] => {
  return Array.from({ length: count }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
};

describe('usePagination Hook with Vitest', () => {
  it('should initialize with the first page of items', () => {
    const allItems = createMockItems(10);
    const itemsPerPage = 3;
    const { result } = renderHook(() => usePagination({ allItems, itemsPerPage }));

    expect(result.current.displayedItems).toEqual(allItems.slice(0, 3));
    expect(result.current.canPrevPage).toBe(false);
    expect(result.current.canNextPage).toBe(true);
  });

  it('should correctly calculate totalPages and canNextPage for an exact multiple', () => {
    const allItems = createMockItems(9); // 3 pages exactly
    const itemsPerPage = 3;
    const { result } = renderHook(() => usePagination({ allItems, itemsPerPage }));

    // Initially on page 0
    expect(result.current.displayedItems.length).toBe(3);
    expect(result.current.canNextPage).toBe(true);

    act(() => {
      result.current.handleNextPage(); // Go to page 1
    });
    expect(result.current.displayedItems.length).toBe(3);
    expect(result.current.canNextPage).toBe(true);

    act(() => {
      result.current.handleNextPage(); // Go to page 2 (last page)
    });
    expect(result.current.displayedItems.length).toBe(3);
    expect(result.current.canNextPage).toBe(false);
  });

  it('should handle handleNextPage correctly', () => {
    const allItems = createMockItems(7); // 3 pages: 3, 3, 1
    const itemsPerPage = 3;
    const { result } = renderHook(() => usePagination({ allItems, itemsPerPage }));

    act(() => {
      result.current.handleNextPage();
    });
    expect(result.current.displayedItems).toEqual(allItems.slice(3, 6));
    expect(result.current.canPrevPage).toBe(true);
    expect(result.current.canNextPage).toBe(true);

    act(() => {
      result.current.handleNextPage();
    });
    expect(result.current.displayedItems).toEqual(allItems.slice(6, 7));
    expect(result.current.canPrevPage).toBe(true);
    expect(result.current.canNextPage).toBe(false); // Should be on the last page
  });

  it('should not go past the last page with handleNextPage', () => {
    const allItems = createMockItems(5);
    const itemsPerPage = 3; // 2 pages: 3, 2
    const { result } = renderHook(() => usePagination({ allItems, itemsPerPage }));

    act(() => {
      result.current.handleNextPage(); // To page 1
    });
    act(() => {
      result.current.handleNextPage(); // Attempt to go past page 1
    });
    expect(result.current.displayedItems).toEqual(allItems.slice(3, 5)); // Still on last page
    expect(result.current.canNextPage).toBe(false);
  });

  it('should handle handlePrevPage correctly', () => {
    const allItems = createMockItems(7);
    const itemsPerPage = 3;
    const { result } = renderHook(() => usePagination({ allItems, itemsPerPage }));

    // Go to the last page first
    act(() => {
      result.current.handleNextPage();
    });
    act(() => {
      result.current.handleNextPage();
    });
    expect(result.current.displayedItems).toEqual(allItems.slice(6, 7)); // On last page

    act(() => {
      result.current.handlePrevPage();
    });
    expect(result.current.displayedItems).toEqual(allItems.slice(3, 6));
    expect(result.current.canPrevPage).toBe(true);
    expect(result.current.canNextPage).toBe(true);
  });

  it('should not go before the first page with handlePrevPage', () => {
    const allItems = createMockItems(5);
    const itemsPerPage = 3;
    const { result } = renderHook(() => usePagination({ allItems, itemsPerPage }));

    act(() => {
      result.current.handlePrevPage(); // Attempt to go before page 0
    });
    expect(result.current.displayedItems).toEqual(allItems.slice(0, 3)); // Still on first page
    expect(result.current.canPrevPage).toBe(false);
  });

  it('should handle empty allItems array gracefully', () => {
    const allItems: TestItem[] = [];
    const itemsPerPage = 5;
    const { result } = renderHook(() => usePagination({ allItems, itemsPerPage }));

    expect(result.current.displayedItems).toEqual([]);
    expect(result.current.canPrevPage).toBe(false);
    expect(result.current.canNextPage).toBe(false);
  });

  it('should update displayedItems when allItems prop changes', () => {
    const initialItems = createMockItems(3);
    const itemsPerPage = 3;
    const { result, rerender } = renderHook(
      (props) => usePagination(props),
      { initialProps: { allItems: initialItems, itemsPerPage } }
    );

    expect(result.current.displayedItems).toEqual(initialItems);

    const newItems = createMockItems(6);
    rerender({ allItems: newItems, itemsPerPage });

    expect(result.current.displayedItems).toEqual(newItems.slice(0, 3));
    expect(result.current.canNextPage).toBe(true); // Assuming current page is still 0
  });
});