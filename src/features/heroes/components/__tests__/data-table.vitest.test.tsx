import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { DataTable } from '../data-table'; // Adjust path as necessary
import type { ColumnDef } from '@tanstack/react-table';

// Mock ShadCN UI Table components
vi.mock('@/components/ui/table', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/components/ui/table')>();
    return {
        ...original,
        Table: vi.fn(({ children }) => <table data-testid="table">{children}</table>),
        TableHeader: vi.fn(({ children }) => <thead data-testid="table-header">{children}</thead>),
        TableBody: vi.fn(({ children }) => <tbody data-testid="table-body">{children}</tbody>),
        TableRow: vi.fn(({ children, ...props }) => <tr {...props} data-testid="table-row">{children}</tr>),
        TableHead: vi.fn(({ children }) => <th data-testid="table-head">{children}</th>),
        TableCell: vi.fn(({ children, ...props }) => <td {...props} data-testid="table-cell">{children}</td>),
    };
});

// Define a simple data type and columns for testing
interface TestData {
  id: string;
  name: string;
  value: number;
}

const testColumns: ColumnDef<TestData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.getValue('name'),
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => row.getValue('value'),
  },
];

const mockData: TestData[] = [
  { id: '1', name: 'Item A', value: 100 },
  { id: '2', name: 'Item B', value: 200 },
  { id: '3', name: 'Item C', value: 300 },
];

describe('DataTable Component with Vitest', () => {
  it('renders table headers correctly based on columns prop', () => {
    render(<DataTable columns={testColumns} data={mockData} />);

    const headers = screen.getAllByTestId('table-head');
    expect(headers).toHaveLength(testColumns.length);
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Value');
  });

  it('renders table rows and cells correctly based on data prop', () => {
    render(<DataTable columns={testColumns} data={mockData} />);

    const rows = screen.getAllByTestId('table-row');
    // +1 for the header row rendered by our mock TableHeader
    expect(rows.filter(row => row.closest('tbody'))).toHaveLength(mockData.length);

    mockData.forEach((item, rowIndex) => {
      // Query within each specific row in the tbody
      const currentRow = screen.getAllByTestId('table-row').filter(row => row.closest('tbody'))[rowIndex];
      const cellsInRow = Array.from(currentRow.querySelectorAll('[data-testid="table-cell"]'));
      
      expect(cellsInRow[0]).toHaveTextContent(item.name);
      expect(cellsInRow[1]).toHaveTextContent(String(item.value));
    });
  });

  it('renders "No results." message when data array is empty', () => {
    render(<DataTable columns={testColumns} data={[]} />);

    const noResultsCell = screen.getByText('No results.');
    expect(noResultsCell).toBeInTheDocument();
    expect(noResultsCell).toHaveAttribute('colSpan', String(testColumns.length));

    // Ensure no data rows are rendered
    const dataRows = screen.getAllByTestId('table-row').filter(row => row.closest('tbody'));
    // There will be one row for the "No results." message
    expect(dataRows).toHaveLength(1); 
  });

  it('handles column filtering (integration with useReactTable state)', () => {
    // This test is more conceptual for this component as filtering logic is internal to useReactTable.
    // We are mainly testing that the table re-renders based on its internal state changes.
    // A more direct test of filtering would involve interacting with an Input if it were part of DataTable.
    // Since the Input is external in HeroSelect, we'll just ensure the table initializes.
    const { rerender } = render(<DataTable columns={testColumns} data={mockData} />);
    
    // Simulate data changing due to filtering (though filter input is not in this component)
    const filteredData = [mockData[0]]; // Assume only Item A matches a filter
    rerender(<DataTable columns={testColumns} data={filteredData} />);

    const rows = screen.getAllByTestId('table-row').filter(row => row.closest('tbody'));
    expect(rows).toHaveLength(filteredData.length);
    expect(rows[0].querySelectorAll('[data-testid="table-cell"]')[0]).toHaveTextContent(filteredData[0].name);
  });
});