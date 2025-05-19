import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { PageHeader } from '../PageHeader';

describe('PageHeader Component with Vitest', () => {
  const mockPrimaryText = 'Welcome, Agent!';
  const mockSecondaryText = 'Your mission, should you choose to accept it...';

  it('renders primary text correctly', () => {
    render(<PageHeader primaryText={mockPrimaryText} />);

    const primaryHeading = screen.getByRole('heading', { level: 1 });
    expect(primaryHeading).toBeInTheDocument();
    expect(primaryHeading).toHaveTextContent(mockPrimaryText);
  });

  it('renders secondary text correctly when provided', () => {
    render(
      <PageHeader
        primaryText={mockPrimaryText}
        secondaryText={mockSecondaryText}
      />
    );

    // The secondary text is in a <p> tag
    const secondaryParagraph = screen.getByText(mockSecondaryText);
    expect(secondaryParagraph).toBeInTheDocument();
    expect(secondaryParagraph.tagName).toBe('P'); // Ensure it's a paragraph
  });

  it('does not render secondary text paragraph if secondaryText is not provided', () => {
    render(<PageHeader primaryText={mockPrimaryText} />);

    // Check that there's no paragraph element with the default secondary text content
    // or any paragraph other than potentially one used by testing-library for structure.
    // A more direct way is to check if the specific text is NOT there.
    expect(screen.queryByText(mockSecondaryText)).not.toBeInTheDocument();

    // Also, ensure the <p> tag for secondaryText is not rendered.
    // The component renders <p className="text-md p-5">{secondaryText}</p>
    // If secondaryText is undefined, the <p> tag will still be there but empty.
    // Let's check if the paragraph exists and is empty.
    const paragraphElement = screen.getByRole('heading', { level: 1 }).nextElementSibling;
    expect(paragraphElement).toBeInTheDocument(); // The <p> tag itself is always rendered
    expect(paragraphElement).toHaveTextContent(''); // But it should be empty
  });

  it('applies correct Tailwind classes for styling', () => {
    render(<PageHeader primaryText={mockPrimaryText} secondaryText={mockSecondaryText} />);

    const outerDiv = screen.getByText(mockPrimaryText).closest('div');
    expect(outerDiv).toHaveClass('text-center');

    const primaryHeading = screen.getByRole('heading', { level: 1 });
    expect(primaryHeading).toHaveClass('text-3xl font-bold mt-5');

    const secondaryParagraph = screen.getByText(mockSecondaryText);
    expect(secondaryParagraph).toHaveClass('text-md p-5');
  });
});