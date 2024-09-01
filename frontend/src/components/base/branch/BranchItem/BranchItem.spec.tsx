import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';

import { BranchItem } from './BranchItem';

const onClick = vi.fn();

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

const PROPS = {
  id: 1231,
  name: 'New Company - Cracov',
  createdAt: '2024-09-01T20:00:09.520Z',
  address: ADDRESS,
  isSelected: false,
  onClick,
  companyId: '8df7580e-1529-4ccd-93cc-d020c738141d',
  isOwner: false,
};

describe('BranchItem', () => {
  it('renders h4 with branch name', () => {
    render(
      <MemoryRouter>
        <BranchItem {...PROPS} />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      PROPS.name
    );
  });

  it('renders short region name', () => {
    render(
      <MemoryRouter>
        <BranchItem {...PROPS} />
      </MemoryRouter>
    );

    const region = screen.getByText(
      new RegExp(ADDRESS.region.split(' ')[1], 'i')
    );

    expect(region).toBeInTheDocument();
  });

  it('renders city with postcode', () => {
    render(
      <MemoryRouter>
        <BranchItem {...PROPS} />
      </MemoryRouter>
    );

    const address = screen.getByText(
      new RegExp(`${ADDRESS.city} ${ADDRESS.postcode}`, 'i')
    );

    expect(address).toBeInTheDocument();
  });

  it('renders street name with building number', () => {
    render(
      <MemoryRouter>
        <BranchItem {...PROPS} />
      </MemoryRouter>
    );

    const address = screen.getByText(
      new RegExp(`${ADDRESS.streetName} ${ADDRESS.houseNumber}`, 'i')
    );

    expect(address).toBeInTheDocument();
  });

  it('renders branch as button when isOwner property is set to false', () => {
    render(
      <MemoryRouter>
        <BranchItem {...PROPS} />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    const buttons = screen.getAllByRole('button');

    expect(button).toBeInTheDocument();
    expect(buttons).toHaveLength(1);
  });

  it('calls onClick when branch item has been clicked and isOwner property is set to false', async () => {
    render(
      <MemoryRouter>
        <BranchItem {...PROPS} />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders dropdown with actions when isOwner property is set to true', () => {
    render(
      <MemoryRouter>
        <BranchItem {...PROPS} isOwner />
      </MemoryRouter>
    );

    const dropdownButton = screen.getByRole('button', {
      name: /przycisk menu/i,
    });
    const buttons = screen.getAllByRole('button');

    expect(dropdownButton).toBeInTheDocument();
    expect(buttons).toHaveLength(1);
  });

  it('renders two buttons and one link when dropdwon is open', async () => {
    render(
      <MemoryRouter>
        <BranchItem {...PROPS} isOwner />
      </MemoryRouter>
    );

    const dropdownButton = screen.getByRole('button', {
      name: /przycisk menu/i,
    });

    await user.click(dropdownButton);

    const centerButton = screen.getByRole('button', {
      name: /wycentruj mape/i,
    });

    const deleteButton = screen.getByRole('button', {
      name: /usuń oddział/i,
    });

    const editLink = screen.getByRole('link', {
      name: /zaktualizuj dane/i,
    });

    const buttons = screen.getAllByRole('button');

    expect(centerButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(editLink).toBeInTheDocument();
    expect(buttons).toHaveLength(3);
  });
});
