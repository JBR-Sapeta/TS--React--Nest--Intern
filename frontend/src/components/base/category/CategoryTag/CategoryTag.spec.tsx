import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { CategoryTag } from './CategoryTag';

const PROPS = {
  name: 'Administracja',
};

describe('CategoryTag', () => {
  it('renders category name', () => {
    render(<CategoryTag {...PROPS} />);

    const categoryName = screen.getByText(PROPS.name);

    expect(categoryName).toBeInTheDocument();
  });
});
