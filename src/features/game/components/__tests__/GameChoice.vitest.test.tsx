import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // For Vitest-specific jest-dom matchers
import { describe, it, expect, vi } from 'vitest';
import { GameChoice } from '../GameChoice';
import type { Option } from '../../models/option';

// Mock the Button component from ShadCN
// This is useful if the Button has complex internals or context dependencies.
// For a simple button, you might not always need to mock it, but it helps isolate your component.
vi.mock('@/components/ui/button', () => ({
  Button: vi.fn(({ onClick, children, className, variant }) => (
    <button
      data-testid="game-choice-button"
      className={className}
      data-variant={variant}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
    >
      {children}
    </button>
  )),
}));

describe('GameChoice Component with Vitest', () => {
  const mockOption: Option = {
    id: 'option123',
    text: 'Choose this path!',
  };

  it('renders the option text correctly', () => {
    const handleClick = vi.fn();
    render(<GameChoice option={mockOption} onClick={handleClick} />);

    // The text is wrapped in a <p> tag inside the button in your component
    const buttonElement = screen.getByTestId('game-choice-button');
    expect(buttonElement).toHaveTextContent(mockOption.text);
  });

  it('calls the onClick handler with the correct option ID when clicked', () => {
    const handleClick = vi.fn();
    render(<GameChoice option={mockOption} onClick={handleClick} />);

    const buttonElement = screen.getByTestId('game-choice-button');
    fireEvent.click(buttonElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockOption.id);
  });

  it('passes correct variant and classes to the underlying Button component', () => {
    const handleClick = vi.fn();
    render(<GameChoice option={mockOption} onClick={handleClick} />);
    const buttonElement = screen.getByTestId('game-choice-button');
    expect(buttonElement).toHaveAttribute('data-variant', 'outline');
    expect(buttonElement).toHaveClass('w-full h-15 p-5 whitespace-normal bg-slate-700');
  });
});