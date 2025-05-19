import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LeaderboardTable } from '../LeaderboardTable';
import { leaderboardColumns as actualColumns, data as actualData, type User } from '../../data';

// This will be our controllable mock data for the tests
let currentMockData: User[] = [];

// Mock the '../data' module to control the `data` export
vi.mock('../data', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('../../data')>();
  return {
    ...originalModule,
    leaderboardColumns: actualColumns, // Use actual columns
    get data() { return currentMockData; }, // Use a getter to allow dynamic changes
  };
});

// Mock ShadCN UI Table components
vi.mock('@/components/ui/table', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/components/ui/table')>();
    return {
        ...original,
        Table: vi.fn(({ children, className }) => <table className={className} data-testid="table">{children}</table>),
        TableHeader: vi.fn(({ children, className }) => <thead className={className} data-testid="table-header">{children}</thead>),
        TableBody: vi.fn(({ children }) => <tbody data-testid="table-body">{children}</tbody>),
        TableRow: vi.fn(({ children, ...props }) => <tr {...props} data-testid="table-row">{children}</tr>),
        TableHead: vi.fn(({ children, onClick, className, style }) => (
            <th data-testid="table-head" onClick={onClick as React.MouseEventHandler<HTMLTableCellElement>} className={className} style={style}>
                {children}
            </th>
        )),
        TableCell: vi.fn(({ children, className }) => <td className={className} data-testid="table-cell">{children}</td>),
    };
});

// Mock Lucide icons
vi.mock('lucide-react', async (importOriginal) => {
    const original = await importOriginal<typeof import('lucide-react')>();
    return {
        ...original,
        ArrowDownUp: vi.fn(() => <div data-testid="icon-sort-default">SortDefault</div>),
        ArrowDownWideNarrow: vi.fn(() => <div data-testid="icon-sort-desc">SortDesc</div>),
        ArrowUpNarrowWide: vi.fn(() => <div data-testid="icon-sort-asc">SortAsc</div>),
    };
});

// Mock cn utility
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]): string => {
    const classes: string[] = [];
    for (const input of inputs) {
      if (typeof input === 'string' && input) {
        classes.push(input);
      } else if (typeof input === 'object' && input !== null) {
        for (const key in input) {
          // eslint-disable-next-line no-prototype-builtins
          if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
            classes.push(key);
          }
        }
      }
    }
    return classes.join(' ');
  },
}));


describe('LeaderboardTable Component with Vitest', () => {
  beforeEach(() => {
    // Reset to actual data for most tests
    currentMockData = [...actualData];
    vi.clearAllMocks();
  });

  it('renders table headers correctly', () => {
    render(<LeaderboardTable />);
    const headers = screen.getAllByTestId('table-head');
    expect(headers).toHaveLength(actualColumns.length);

    actualColumns.forEach((col, index) => {
      if (typeof col.header === 'string') {
        expect(headers[index]).toHaveTextContent(col.header);
      } else if (col.id === 'rank') { // Special case for rank header
        expect(headers[index]).toHaveTextContent('Rank');
      }
    });
  });

  it('renders table rows and cells correctly with initial data', () => {
    render(<LeaderboardTable />);
    const dataRows = screen.getAllByTestId('table-row').filter(row => row.closest('tbody'));
    expect(dataRows).toHaveLength(currentMockData.length);

    // Check content of the first data row as a sample
    const firstDataRowCells = within(dataRows[0]).getAllByTestId('table-cell');
    // Rank is 1-based and depends on sorting, but for initial unsorted (by rank) it's complex.
    // Let's check other cells.
    // The rank cell will display '1' due to its cell implementation and initial sort by prestige
    expect(firstDataRowCells[0]).toHaveTextContent('1'); // Assuming RoguePhantom is first due to prestige sort
    expect(firstDataRowCells[1]).toHaveTextContent(currentMockData.find(u => u.prestige === 888)!.username); // RoguePhantom
    expect(firstDataRowCells[2]).toHaveTextContent(String(currentMockData.find(u => u.prestige === 888)!.prestige));
  });

  it('applies correct classes to table elements', () => {
    render(<LeaderboardTable />);
    // The Table component itself is mocked, so we check its parent div for these classes
    const tableWrapper = screen.getByTestId('table').parentElement;
    expect(tableWrapper).toHaveClass('bg-slate-800 border border-slate-600 rounded-sm overflow-hidden');
    
    expect(screen.getByTestId('table-header')).toHaveClass('bg-slate-700');
    
    const firstHeader = screen.getAllByTestId('table-head')[0];
    expect(firstHeader).toHaveClass('py-3 not-last:text-left font-semibold uppercase tracking-widest text-blue-400');
  });
});