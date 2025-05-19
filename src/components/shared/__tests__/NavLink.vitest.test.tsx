import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { NavLink } from '../NavLink';
import type { NavItem } from '@/lib/nav';

// Mock the Link component from TanStack Router
vi.mock('@tanstack/react-router', async (importOriginal) => {
    const original = await importOriginal<typeof import('@tanstack/react-router')>();
    return {
        ...original,
        Link: vi.fn(({ to, children, ...rest }) => (
            <a href={to as string} data-testid="mock-link" {...rest}>
                {children}
            </a>
        )),
    };
});

describe('NavLink Component with Vitest', () => {
  const mockNavItem: NavItem = {
    label: 'Dashboard',
    href: '/dashboard',
  };

  it('renders the label correctly', () => {
    render(<NavLink {...mockNavItem} />);
    expect(screen.getByText(mockNavItem.label)).toBeInTheDocument();
  });

  it('passes the correct href to the underlying Link component', () => {
    render(<NavLink {...mockNavItem} />);
    const linkElement = screen.getByTestId('mock-link');
    expect(linkElement).toHaveAttribute('href', mockNavItem.href);
  });

  it('renders the Link component', () => {
    render(<NavLink {...mockNavItem} />);
    expect(screen.getByTestId('mock-link')).toBeInTheDocument();
  });
});