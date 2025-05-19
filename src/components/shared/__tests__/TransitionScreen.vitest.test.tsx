import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { TransitionScreen } from '../TransitionScreen';

// Mock Lucide's Loader2 icon
vi.mock('lucide-react', async (importOriginal) => {
    const original = await importOriginal<typeof import('lucide-react')>();
    return {
        ...original,
        Loader2: vi.fn((props) => <div data-testid="loader-icon" className={props.className}>Spinner</div>),
    };
});

describe('TransitionScreen Component with Vitest', () => {
  const mockText = 'Loading your mission details...';

  it('renders the provided text correctly', () => {
    render(<TransitionScreen text={mockText} />);
    expect(screen.getByText(mockText)).toBeInTheDocument();
  });

  it('renders the Loader2 icon', () => {
    render(<TransitionScreen text={mockText} />);
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByTestId('loader-icon')).toHaveTextContent('Spinner'); // From our mock
  });

  it('applies correct Tailwind classes for styling', () => {
    render(<TransitionScreen text={mockText} />);

    const outerDiv = screen.getByText(mockText).closest('div.fixed');
    expect(outerDiv).toHaveClass('fixed inset-0 backdrop-blur-sm flex flex-col items-center justify-center');

    const loaderIcon = screen.getByTestId('loader-icon');
    expect(loaderIcon).toHaveClass('h-10 w-10 animate-spin mb-5');

    const textParagraph = screen.getByText(mockText);
    expect(textParagraph).toHaveClass('text-xl font-semibold');
  });
});