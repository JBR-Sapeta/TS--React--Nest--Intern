import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { CompaniesMap } from './CompaniesMap';

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

const COMPANY = {
  id: 'b2b21f2b-d901-41aa-8b8a-898ded2228a6',
  name: 'New Company ',
  slug: 'new-company',
  logoUrl: null,
  size: 100,
  locations: [],
  branches: [BRANCH],
  categories: [],
};

const PROPS = {
  companies: [COMPANY],
};

describe('CompaniesMap', () => {
  it('renders zoom in button', () => {
    render(<CompaniesMap {...PROPS} />);

    const zoomIn = screen.getByRole('button', { name: /zoom in/i });

    expect(zoomIn).toBeInTheDocument();
  });

  it('renders zoom out button', () => {
    render(<CompaniesMap {...PROPS} />);

    const zoomOut = screen.getByRole('button', { name: /zoom out/i });

    expect(zoomOut).toBeInTheDocument();
  });
});
