import { vi, describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import { REGION_OPTIONS } from '@Common/constants';

import { CompanySearchParams } from './CompanySearchParams';

const INITIAL_VALUES = {
  city: '',
  region: '',
  categories: '',
  long: '',
  lat: '',
  range: '',
};

const setCityParam = vi.fn();
const setLatParam = vi.fn();
const setLongParam = vi.fn();
const setRangeParam = vi.fn();
const setRegionParam = vi.fn();
const changeCity = vi.fn();
const changeRegion = vi.fn();
const changeRange = vi.fn();
const setUserLocation = vi.fn();

const props = {
  setCityParam,
  setLatParam,
  setLongParam,
  setRangeParam,
  setRegionParam,
  changeCity,
  changeRegion,
  changeRange,
  setUserLocation,
  values: INITIAL_VALUES,
};

describe('CompanySearchParams', () => {
  it('renders four inputs', () => {
    render(<CompanySearchParams {...props} />);

    const regionInput = screen.getByRole('combobox', { name: /województwo/i });
    const cityInput = screen.getByRole('textbox', { name: /miasto/i });
    const rangeInput = screen.getByRole('combobox', { name: /odległość/i });
    const locationInput = screen.getByRole('checkbox', { name: /udostępnij/i });

    expect(regionInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(rangeInput).toBeInTheDocument();
    expect(locationInput).toBeInTheDocument();
  });

  it('calls input functions whenever the user enters a new value to base inputs', async () => {
    render(<CompanySearchParams {...props} />);

    const regionInput = screen.getByRole('combobox', { name: /województwo/i });
    const cityInput = screen.getByRole('textbox', { name: /miasto/i });

    await user.click(regionInput);
    await user.selectOptions(regionInput, REGION_OPTIONS[0].value);

    await user.click(cityInput);
    await user.keyboard('A');

    expect(changeRegion).toHaveBeenCalledTimes(1);
    expect(changeCity).toHaveBeenCalledTimes(1);
  });

  it('calls reset city and region whenwer user click share location input', async () => {
    render(<CompanySearchParams {...props} />);

    const locationInput = screen.getByRole('checkbox', { name: /udostępnij/i });

    await user.click(locationInput);

    expect(changeRegion).toHaveBeenCalledTimes(1);
    expect(changeCity).toHaveBeenCalledTimes(1);
  });
});
