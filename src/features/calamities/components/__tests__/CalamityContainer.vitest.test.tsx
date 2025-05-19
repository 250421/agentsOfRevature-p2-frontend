import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // For Vitest-specific jest-dom matchers
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalamityContainer } from '../CalamityContainer';
import type { Calamity } from '../../models/calamity';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { usePagination } from '@/hooks/usePagination';

// Mock CalamityCard
vi.mock('../CalamityCard', () => ({
  CalamityCard: vi.fn(({ title }) => <div data-testid="calamity-card">{title}</div>),
}));

// Mock PaginationControls
vi.mock('@/components/shared/PaginationControls', () => ({
  PaginationControls: vi.fn((props) => {
    return <div data-testid="pagination-controls">Pagination Controls</div>;
  }),
}));

// Mock usePagination hook
const mockUsePaginationResult = {
  displayedItems: [] as Calamity[],
  handlePrevPage: vi.fn(),
  handleNextPage: vi.fn(),
  canPrevPage: false,
  canNextPage: false,
};
vi.mock('@/hooks/usePagination', () => ({
  usePagination: vi.fn((...args) => {
    return mockUsePaginationResult;
  }),
}));

// Mock Loader2 icon
vi.mock('lucide-react', async (importOriginal) => {
    const original = await importOriginal<typeof import('lucide-react')>()
    return {
        ...original,
        Loader2: vi.fn(() => <div data-testid="loader-icon">Loading...</div>),
    }
});

const createMockCalamities = (count: number): Calamity[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Calamity ${i + 1}`,
    location: `Location ${i + 1}`,
    severity: 'MEDIUM',
    description: `Description for calamity ${i + 1}`,
    reported: new Date().toISOString(),
  }));
};

describe('CalamityContainer Component with Vitest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock usePagination result for each test
    mockUsePaginationResult.displayedItems = [];
    mockUsePaginationResult.canPrevPage = false;
    mockUsePaginationResult.canNextPage = false;
    mockUsePaginationResult.handlePrevPage.mockClear();
    mockUsePaginationResult.handleNextPage.mockClear();
  });

  it('renders loading spinner when isLoading is true', () => {
    render(<CalamityContainer calamities={[]} isLoading={true} />);
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('pagination-controls')).not.toBeInTheDocument();
    expect(screen.queryByTestId('calamity-card')).not.toBeInTheDocument();
  });

  it('renders "0 active calamities" and no cards when calamities array is empty and not loading', () => {
    mockUsePaginationResult.displayedItems = [];
    render(<CalamityContainer calamities={[]} isLoading={false} />);

    expect(screen.getByText('0 active calamities')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-controls')).toBeInTheDocument();
    expect(screen.queryByTestId('calamity-card')).not.toBeInTheDocument();
  });

  it('renders correct number of active calamities and displayed calamity cards', () => {
    const allCalamities = createMockCalamities(5);
    const displayedCalamities = allCalamities.slice(0, 3); // Assume usePagination returns these
    mockUsePaginationResult.displayedItems = displayedCalamities;

    render(<CalamityContainer calamities={allCalamities} isLoading={false} />);

    expect(screen.getByText('5 active calamities')).toBeInTheDocument();
    expect(screen.getByTestId('pagination-controls')).toBeInTheDocument();

    const calamityCards = screen.getAllByTestId('calamity-card');
    expect(calamityCards).toHaveLength(displayedCalamities.length);
    displayedCalamities.forEach((calamity, index) => {
      expect(within(calamityCards[index]).getByText(calamity.title)).toBeInTheDocument();
    });
  });

  it('calls usePagination with correct parameters', () => {
    const allCalamities = createMockCalamities(7);
    const itemsPerPage = 3; // As defined in CalamityContainer

    render(<CalamityContainer calamities={allCalamities} isLoading={false} />);

    expect(vi.mocked(usePagination)).toHaveBeenCalledWith({
      itemsPerPage: itemsPerPage,
      allItems: allCalamities,
    });
  });

  it('passes pagination control props to PaginationControls component', () => {
    mockUsePaginationResult.canPrevPage = true;
    mockUsePaginationResult.canNextPage = true;

    render(<CalamityContainer calamities={createMockCalamities(5)} isLoading={false} />);

    // Get the mock function for PaginationControls
    const mockedPaginationControls = vi.mocked(PaginationControls);
    // Check that it was called at least once
    expect(mockedPaginationControls).toHaveBeenCalled();
    // Get the props of the last call
    const lastCallProps = mockedPaginationControls.mock.calls[mockedPaginationControls.mock.calls.length - 1][0];
    expect(lastCallProps.canPrevPage).toBe(true);
    expect(lastCallProps.canNextPage).toBe(true);
    expect(lastCallProps.handlePrevPage).toBe(mockUsePaginationResult.handlePrevPage);
    expect(lastCallProps.handleNextPage).toBe(mockUsePaginationResult.handleNextPage);
  });
});