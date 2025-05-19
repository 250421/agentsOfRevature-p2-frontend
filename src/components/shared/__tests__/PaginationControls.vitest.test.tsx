import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaginationControls } from '../PaginationControls';

// Mock Lucide icons
vi.mock('lucide-react', async (importOriginal) => {
    const original = await importOriginal<typeof import('lucide-react')>();
    return {
        ...original,
        StepBack: vi.fn(() => <div data-testid="icon-step-back">Prev</div>),
        StepForward: vi.fn(() => <div data-testid="icon-step-forward">Next</div>),
    };
});

// Mock Button component from ShadCN
vi.mock('../ui/button', () => ({ // Assuming Button is in ../ui/button relative to PaginationControls
  Button: vi.fn(({ onClick, disabled, children, className, variant }) => {
    // Determine if this is the 'prev' or 'next' button based on the child icon's testid
    let buttonType = 'unknown';
    if (children && typeof children === 'object' && 'props' in children && children.props['data-testid']) {
      if (children.props['data-testid'] === 'icon-step-back') {
        buttonType = 'prev';
      } else if (children.props['data-testid'] === 'icon-step-forward') {
        buttonType = 'next';
      }
    }
    return (<button
      data-testid={`pagination-button-${buttonType}`}
      data-variant={variant}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      disabled={disabled}
    >
      {children}
    </button>
  )}),
}));

describe('PaginationControls Component with Vitest', () => {
  let mockHandlePrevPage: ReturnType<typeof vi.fn>;
  let mockHandleNextPage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHandlePrevPage = vi.fn();
    mockHandleNextPage = vi.fn();
  });

  it('renders both buttons with correct icons', () => {
    render(
      <PaginationControls
        handlePrevPage={mockHandlePrevPage}
        handleNextPage={mockHandleNextPage}
        canPrevPage={true}
        canNextPage={true}
      />
    );
    expect(screen.getByTestId('icon-step-back')).toBeInTheDocument();
    expect(screen.getByTestId('icon-step-forward')).toBeInTheDocument();
  });
});