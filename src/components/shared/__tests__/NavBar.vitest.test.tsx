import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { navItems as actualNavItems, type NavItem } from '@/lib/nav';

// --- Mocks ---

// This is the actual mock function that will be the default export of the mocked '@/store'
const mockedUseStoreFn = vi.fn();
vi.doMock('@/store', () => ({
    __esModule: true, // For ES Modules compatibility
  default: mockedUseStoreFn,
}));

// Mock useConfirm hook
const mockConfirmLogoutAction = vi.fn();
// It's important that the mock component can be rendered.
const MockConfirmLogoutDialogComponent = vi.fn(({ title, description, confirmLabel }) => (
  <div data-testid="confirm-logout-dialog">
    <h2>{title}</h2>
    <p>{description}</p>
    <span>{confirmLabel}</span>
  </div>
));
vi.doMock('@/hooks/use-confirm', () => ({
    useConfirm: () => [mockConfirmLogoutAction, MockConfirmLogoutDialogComponent],
}));

// Mock useSignOut hook
const mockLogoutMutate = vi.fn();
vi.doMock('@/features/auth/hooks/use-sign-out', () => ({
    useSignOut: () => ({
    mutate: mockLogoutMutate,
  }),
}));

// Mock NavLink component
// We give it a data-testid to make it easier to find and assert its props.
vi.doMock('../NavLink', () => ({
    NavLink: vi.fn(({ href, label }) => (
    <a data-testid={`navlink-${label.toLowerCase().replace(/\s+/g, '-')}`} href={href as string}>
      {label}
    </a>
  )),
}));

// Mock Button component
vi.doMock('../ui/button', () => ({ // Adjusted path assuming Button is in ../ui/button
    Button: vi.fn(({ variant, onClick, children, className }) => (
    <button
      data-variant={variant}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      className={className} // Pass className for potential style checks
    >
      {children}
    </button>
  )),
}));


describe('NavBar Component with Vitest', () => {
    let NavBar: React.FC; // To hold the dynamically imported component

    beforeEach(async () => {
        vi.clearAllMocks();
    // Default store state for logged out for each test
    mockedUseStoreFn.mockImplementation((selector) =>
      selector({ loggedIn: false, username: null })
    );
    const navBarModule = await import('../NavBar');
    NavBar = navBarModule.NavBar;
  });

  it('renders correctly when logged out', () => {
    render(<NavBar />);

    expect(screen.getByText('AGENTS OF REVATURE')).toBeInTheDocument();

    // Nav items should not be present
    actualNavItems.forEach(item => {
      expect(screen.queryByTestId(`navlink-${item.label.toLowerCase().replace(/\s+/g, '-')}`)).not.toBeInTheDocument();
    });

    // Profile link and logout button should not be present
    expect(screen.queryByTestId('navlink-agent-null')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId('confirm-logout-dialog')).not.toBeInTheDocument();
  });

  it('renders correctly when logged in', () => {
    const testUsername = 'TestAgent007';
    mockedUseStoreFn.mockImplementation((selector) =>
      selector({ loggedIn: true, username: testUsername })
    );

    render(<NavBar />);

    expect(screen.getByText('AGENTS OF REVATURE')).toBeInTheDocument();

    // Nav items should be present
    actualNavItems.forEach(item => {
      expect(screen.getByTestId(`navlink-${item.label.toLowerCase().replace(/\s+/g, '-')}`)).toBeInTheDocument();
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });

    // Profile link and logout button should be present
    expect(screen.getByTestId(`navlink-agent-${testUsername.toLowerCase()}`)).toBeInTheDocument();
    expect(screen.getByText(`Agent ${testUsername}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

    // Confirm dialog component should be rendered (or its mock)
    expect(MockConfirmLogoutDialogComponent).toHaveBeenCalled();
    expect(screen.getByTestId('confirm-logout-dialog')).toBeInTheDocument();
    // Check some props of the dialog
    expect(screen.getByText('Are you sure you want to log out?')).toBeInTheDocument();
  });

  it('handles logout process when confirmed', async () => {
    mockedUseStoreFn.mockImplementation((selector) =>
      selector({ loggedIn: true, username: 'TestAgent' })
    );
    mockConfirmLogoutAction.mockResolvedValue(true); // Simulate user confirming

    render(<NavBar />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockConfirmLogoutAction).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockLogoutMutate).toHaveBeenCalledTimes(1);
    });
  });

  it('does not logout when confirmation is cancelled', async () => {
    mockedUseStoreFn.mockImplementation((selector) =>
      selector({ loggedIn: true, username: 'TestAgent' })
    );
    mockConfirmLogoutAction.mockResolvedValue(false); // Simulate user cancelling

    render(<NavBar />);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(mockConfirmLogoutAction).toHaveBeenCalledTimes(1);
    });
    expect(mockLogoutMutate).not.toHaveBeenCalled();
  });
});