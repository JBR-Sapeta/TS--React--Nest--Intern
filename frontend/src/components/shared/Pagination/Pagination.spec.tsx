import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { Pagination } from './Pagination';

const onSetPage = vi.fn();

const baseProps = { totalPages: 3, onSetPage };

describe('Pagination', () => {
  it(`renders curent page button and next page button when currentpPage value is set to 0`, () => {
    render(<Pagination {...baseProps} currentPage={0} />);

    const currentPageButton = screen.getByRole('button', { name: '1' });
    const nextPageButton = screen.getByRole('button', { name: '2' });
    const buttons = screen.getAllByRole('button');

    expect(currentPageButton).toBeInTheDocument();
    expect(nextPageButton).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
  });

  it(`renders curent page button, previous page button  and next page button when currentpPage value is set to 1`, () => {
    render(<Pagination {...baseProps} currentPage={1} />);

    const previousPageButton = screen.getByRole('button', { name: '1' });
    const currentPageButton = screen.getByRole('button', { name: '2' });
    const nextPageButton = screen.getByRole('button', { name: '3' });
    const buttons = screen.getAllByRole('button');

    expect(previousPageButton).toBeInTheDocument();
    expect(currentPageButton).toBeInTheDocument();
    expect(nextPageButton).toBeInTheDocument();
    expect(buttons).toHaveLength(3);
  });

  it(`renders previous page button and curent page button when currentpPage value is set to 2`, () => {
    render(<Pagination {...baseProps} currentPage={2} />);

    const previousPageButton = screen.getByRole('button', { name: '2' });
    const nextPageButton = screen.getByRole('button', { name: '3' });
    const buttons = screen.getAllByRole('button');

    expect(previousPageButton).toBeInTheDocument();
    expect(nextPageButton).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
  });

  it(`calls onSetPage when a button is clicked`, async () => {
    render(<Pagination {...baseProps} currentPage={0} />);

    const nextPageButton = screen.getByRole('button', { name: '2' });

    await user.click(nextPageButton);

    expect(onSetPage).toHaveBeenCalledTimes(1);
  });

  it(`does not show pagesindicator if showPages is ste to false`, async () => {
    render(<Pagination {...baseProps} currentPage={0} />);

    const pageIndicator = screen.queryByText(/strona/i);

    expect(pageIndicator).toBeNull();
  });

  it(`shows pages indicator if showPages is ste to true`, async () => {
    render(<Pagination {...baseProps} currentPage={0} showPages />);

    const pageIndicator = screen.getByText(/strona/i);

    expect(pageIndicator).toBeInTheDocument();
  });
});
