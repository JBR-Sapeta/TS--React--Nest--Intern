import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { BranchMap } from './BranchMap';

const ADDRESS = {
  id: 4,
  country: 'Polska',
  region: 'województwo małopolskie',
  postcode: '31-946',
  city: 'Kraków',
  streetName: 'Osiedle Teatralne',
  houseNumber: '19',
  lat: 50.078917,
  long: 20.032729,
};

const BRANCH = {
  id: 1231,
  name: 'New Company - Cracov',
  createdAt: '2024-09-01T20:00:09.520Z',
  address: ADDRESS,
};

const PROPS = {
  currentBranch: BRANCH,
  branches: [BRANCH],
};

describe('BranchMap', () => {
  it('renders zoom in button', () => {
    render(<BranchMap {...PROPS} />);

    const zoomIn = screen.getByRole('button', { name: /zoom in/i });

    expect(zoomIn).toBeInTheDocument();
  });

  it('renders zoom out button', () => {
    render(<BranchMap {...PROPS} />);

    const zoomOut = screen.getByRole('button', { name: /zoom out/i });

    expect(zoomOut).toBeInTheDocument();
  });
});
