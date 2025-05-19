import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // For Vitest-specific jest-dom matchers
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalamityCard } from '../CalamityCard';
import type { Calamity } from '../../models/calamity';

// Mock SeverityBadge
vi.mock('../SeverityBadge', () => ({
  SeverityBadge: vi.fn(({ severity }) => <div data-testid="severity-badge">Severity: {severity}</div>),
}));

// Mock useConfirm hook
const mockConfirmAction = vi.fn();
const MockRespondDialogComponent = vi.fn(({ title, description, confirmLabel }) => (
  <div data-testid="respond-dialog">
    <h2>{title}</h2>
    <p>{description}</p>
    <span>{confirmLabel}</span>
  </div>
));
vi.mock('@/hooks/use-confirm', () => ({
  useConfirm: () => [mockConfirmAction, MockRespondDialogComponent],
}));

// Mock useNavigate from TanStack Router
const mockNavigate = vi.fn();
vi.mock('@tanstack/react-router', async (importOriginal) => {
    const original = await importOriginal<typeof import('@tanstack/react-router')>()
    return {
        ...original,
        useNavigate: () => mockNavigate,
    }
});

// Mock ShadCN UI components (optional, but can simplify if they have complex internals)
// For now, we'll let them render as is, but if tests become slow or complex,
// mocking them as simple divs can be an option.
vi.mock('@/components/ui/card', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/components/ui/card')>()
    return {
        ...original,
        Card: vi.fn(({ className, children }) => <div className={className} data-testid="card">{children}</div>),
        CardHeader: vi.fn(({ children, className }) => <div className={className} data-testid="card-header">{children}</div>),
        CardTitle: vi.fn(({ children, className }) => <h3 className={className} data-testid="card-title">{children}</h3>),
        CardContent: vi.fn(({ children, className }) => <div className={className} data-testid="card-content">{children}</div>),
        CardFooter: vi.fn(({ children, className }) => <div className={className} data-testid="card-footer">{children}</div>),
    }
});
vi.mock('@/components/ui/button', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/components/ui/button')>()
    return {
        ...original,
        Button: vi.fn(({ onClick, children, className }) => <button className={className} onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}>{children}</button>),
    }
});
vi.mock('@/components/ui/separator', () => ({
    Separator: vi.fn(({className}) => <hr className={className} data-testid="separator" />),
}));


const mockCalamity: Calamity = {
  id: 1,
  title: 'Volcano Eruption',
  location: 'Mount Doom',
  severity: 'CRITICAL',
  description: 'A massive volcano is about to erupt, threatening nearby villages.',
  reported: '2023-10-27 10:00 AM',
};

describe('CalamityCard Component with Vitest', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  it('renders calamity details correctly', () => {
    render(<CalamityCard {...mockCalamity} />);

    expect(screen.getByTestId('card-title')).toHaveTextContent(mockCalamity.title);
    expect(screen.getByText(mockCalamity.reported)).toBeInTheDocument();
    expect(screen.getByText(mockCalamity.location)).toBeInTheDocument();
    expect(screen.getByText(mockCalamity.description)).toBeInTheDocument();
    expect(screen.getByTestId('severity-badge')).toHaveTextContent(`Severity: ${mockCalamity.severity}`);
  });

  it('applies correct border class based on severity', () => {
    const criticalCalamity: Calamity = { ...mockCalamity, severity: 'CRITICAL' };
    const highCalamity: Calamity = { ...mockCalamity, severity: 'HIGH', id: 2 };
    const mediumCalamity: Calamity = { ...mockCalamity, severity: 'MEDIUM', id: 3 };
    const lowCalamity: Calamity = { ...mockCalamity, severity: 'LOW', id: 4 };

    const { rerender } = render(<CalamityCard {...criticalCalamity} />);
    expect(screen.getByTestId('card')).toHaveClass('border-l-purple-700');

    rerender(<CalamityCard {...highCalamity} />);
    expect(screen.getByTestId('card')).toHaveClass('border-l-red-600');

    rerender(<CalamityCard {...mediumCalamity} />);
    expect(screen.getByTestId('card')).toHaveClass('border-l-orange-400');

    rerender(<CalamityCard {...lowCalamity} />);
    expect(screen.getByTestId('card')).toHaveClass('border-l-yellow-400');
  });

  it('calls confirmRespondDialog and navigates on confirmed respond', async () => {
    mockConfirmAction.mockResolvedValueOnce(true); // Simulate user confirming

    render(<CalamityCard {...mockCalamity} />);

    const respondButton = screen.getByRole('button', { name: /RESPOND/i });
    fireEvent.click(respondButton);

    await waitFor(() => {
      expect(mockConfirmAction).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({
        to: '/heroselect',
        search: { calamityId: mockCalamity.id },
      });
    });
  });

  it('calls confirmRespondDialog and does not navigate on cancelled respond', async () => {
    mockConfirmAction.mockResolvedValueOnce(false); // Simulate user cancelling

    render(<CalamityCard {...mockCalamity} />);

    const respondButton = screen.getByRole('button', { name: /RESPOND/i });
    fireEvent.click(respondButton);

    await waitFor(() => {
      expect(mockConfirmAction).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});