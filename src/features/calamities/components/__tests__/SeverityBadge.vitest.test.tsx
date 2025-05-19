import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest'; // For Vitest-specific jest-dom matchers
import { describe, it, expect, vi } from 'vitest';
import { SeverityBadge } from '../SeverityBadge';
import type { SeverityLevel } from '../../models/data';

// Mock the Badge component from ShadCN if it has complex internals or context dependencies.
// For this simple case, we can often let it render, but mocking is an option.
// If you choose to mock:
vi.mock('@/components/ui/badge', () => ({
  Badge: vi.fn(({ className, children }) => (
    <div className={`mock-badge ${className}`} data-testid="badge">
      {children}
    </div>
  )),
}));

// Mock cn utility if it's doing more than just joining strings,
// or if you want to isolate the component logic further.
// For simple class joining, it's often not necessary to mock.
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

describe('SeverityBadge Component with Vitest', () => {
  const testCases: { severity: SeverityLevel; expectedClass: string }[] = [
    { severity: 'CRITICAL', expectedClass: 'bg-purple-700' },
    { severity: 'HIGH', expectedClass: 'bg-red-600' },
    { severity: 'MEDIUM', expectedClass: 'bg-orange-400' },
    { severity: 'LOW', expectedClass: 'bg-yellow-400' },
  ];

  testCases.forEach(({ severity, expectedClass }) => {
    it(`renders correctly for ${severity} severity`, () => {
      render(<SeverityBadge severity={severity} />);

      // Check the text content
      const badgeElement = screen.getByTestId('badge'); // Using testid from mocked Badge
      expect(badgeElement).toHaveTextContent(`Severity: ${severity.toUpperCase()}`);

      // Check for the specific background class
      // The mock for cn helps here by just joining the classes.
      // The mocked Badge component also helps by applying the className prop.
      expect(badgeElement).toHaveClass(expectedClass);
    });
  });

  it('renders with default Badge classes if no specific severity class matches (though current logic always matches)', () => {
    // This test is more of a thought exercise for robustness,
    // as the current component logic always assigns a class.
    // If the logic changed to have a default, this would be more relevant.
    render(<SeverityBadge severity={'UNKNOWN' as SeverityLevel} />); // Test with an unexpected severity

    const badgeElement = screen.getByTestId('badge');
    expect(badgeElement).toHaveTextContent('Severity: UNKNOWN');
    // It won't have one of the specific bg-* classes from the testCases
    testCases.forEach(({ expectedClass }) => {
      expect(badgeElement).not.toHaveClass(expectedClass);
    });
    // It will have the base 'mock-badge' class from our mock
    expect(badgeElement).toHaveClass('mock-badge');
  });
});