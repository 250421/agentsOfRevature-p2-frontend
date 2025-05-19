import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // For Vitest-specific jest-dom matchers
import { describe, it, expect, vi } from 'vitest';
import { GameText } from '../GameText';

// Mock ShadCN UI components
vi.mock('@/components/ui/card', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/components/ui/card')>()
    return {
        ...original,
        Card: vi.fn(({ children, className }) => <div className={className} data-testid="card">{children}</div>),
        CardHeader: vi.fn(({ children }) => <div data-testid="card-header">{children}</div>),
        CardTitle: vi.fn(({ children, className }) => <h2 className={className} data-testid="card-title">{children}</h2>),
        CardContent: vi.fn(({ children }) => <div data-testid="card-content">{children}</div>),
    }
});

vi.mock('@/components/ui/separator', () => ({
    Separator: vi.fn(() => <hr data-testid="separator" />),
}));

describe('GameText Component with Vitest', () => {
  const mockGameText = "The heroes found themselves at a crossroads, a dark forest loomed to the north, and a treacherous mountain pass to the east.";
  const mockChapter = 3;

  it('renders the game text correctly', () => {
    render(<GameText gameText={mockGameText} chapter={mockChapter} />);

    const cardContent = screen.getByTestId('card-content');
    // Check for the game text within the CardContent
    expect(cardContent.querySelector('p')).toHaveTextContent(mockGameText);
  });

  it('renders the chapter number correctly', () => {
    render(<GameText gameText={mockGameText} chapter={mockChapter} />);

    const cardTitle = screen.getByTestId('card-title');
    // Check for the chapter information within the CardTitle
    expect(cardTitle).toHaveTextContent(`Chapter ${mockChapter}/5`);
  });

  it('renders the static title "The Current Situation"', () => {
    render(<GameText gameText={mockGameText} chapter={mockChapter} />);

    const cardTitle = screen.getByTestId('card-title');
    expect(cardTitle).toHaveTextContent('The Current Situation');
  });

  it('applies correct base classes to the outer div', () => {
    render(<GameText gameText={mockGameText} chapter={mockChapter} />);
    // The component's root div has specific classes
    const outerDiv = screen.getByTestId('card').parentElement; // The Card is wrapped by a div
    expect(outerDiv).toHaveClass('min-w-min bg-slate-800');
  });

  it('renders Separator component', () => {
    render(<GameText gameText={mockGameText} chapter={mockChapter} />);
    expect(screen.getByTestId('separator')).toBeInTheDocument();
  });
});