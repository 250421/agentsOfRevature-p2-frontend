import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // For Vitest-specific jest-dom matchers
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameChoiceContainer } from '../GameChoiceContainer';
import type { Option } from '../../models/option';

// Mock GameChoice component
vi.mock('../GameChoice', () => ({
  GameChoice: vi.fn(({ option, onClick }) => (
    <button
      data-testid={`game-choice-${option.id}`}
      onClick={() => onClick(option.id)}
    >
      {option.text}
    </button>
  )),
}));

// Mock ShadCN UI Card components
vi.mock('@/components/ui/card', async (importOriginal) => {
    const original = await importOriginal<typeof import('@/components/ui/card')>()
    return {
        ...original,
        Card: vi.fn(({ children }) => <div data-testid="card">{children}</div>),
        CardHeader: vi.fn(({ children }) => <div data-testid="card-header">{children}</div>),
        CardTitle: vi.fn(({ children }) => <h2 data-testid="card-title">{children}</h2>),
        CardContent: vi.fn(({ children }) => <div data-testid="card-content">{children}</div>),
    }
});

const mockOptions: Option[] = [
  { id: 'opt1', text: 'Attack the Dragon' },
  { id: 'opt2', text: 'Negotiate with the Goblins' },
  { id: 'opt3', text: 'Search for Treasure' },
];

describe('GameChoiceContainer Component with Vitest', () => {
  let mockOnOptionSelect: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnOptionSelect = vi.fn();
  });

  it('renders the title correctly', () => {
    render(
      <GameChoiceContainer
        options={mockOptions}
        onOptionSelect={mockOnOptionSelect}
      />
    );
    expect(screen.getByTestId('card-title')).toHaveTextContent(
      "Choose Your Team's Next Action:"
    );
  });

  it('renders the correct number of GameChoice components', () => {
    render(
      <GameChoiceContainer
        options={mockOptions}
        onOptionSelect={mockOnOptionSelect}
      />
    );

    const gameChoiceButtons = screen.getAllByRole('button'); // Our mock GameChoice is a button
    expect(gameChoiceButtons).toHaveLength(mockOptions.length);

    mockOptions.forEach((option) => {
      expect(screen.getByTestId(`game-choice-${option.id}`)).toHaveTextContent(option.text);
    });
  });

  it('calls onOptionSelect with the correct option ID when a GameChoice is clicked', () => {
    render(
      <GameChoiceContainer
        options={mockOptions}
        onOptionSelect={mockOnOptionSelect}
      />
    );

    const firstOptionButton = screen.getByTestId(`game-choice-${mockOptions[0].id}`);
    fireEvent.click(firstOptionButton);

    expect(mockOnOptionSelect).toHaveBeenCalledTimes(1);
    expect(mockOnOptionSelect).toHaveBeenCalledWith(mockOptions[0].id);

    const secondOptionButton = screen.getByTestId(`game-choice-${mockOptions[1].id}`);
    fireEvent.click(secondOptionButton);

    expect(mockOnOptionSelect).toHaveBeenCalledTimes(2);
    expect(mockOnOptionSelect).toHaveBeenCalledWith(mockOptions[1].id);
  });

  it('renders no GameChoice components if options array is empty', () => {
    render(
      <GameChoiceContainer options={[]} onOptionSelect={mockOnOptionSelect} />
    );
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });
});