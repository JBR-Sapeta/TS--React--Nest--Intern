import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { StatusIndicator } from './StatusIndicator';

const baseProps = {
  activLabel: 'Is active',
  inactiveLable: 'Is not active',
};

describe('StatusIndicator', () => {
  it(`renders active message when isActive property is set to true`, () => {
    render(<StatusIndicator {...baseProps} isActive />);

    const activLabel = screen.getByText(baseProps.activLabel);
    const inactiveLable = screen.queryByText(baseProps.inactiveLable);

    expect(activLabel).toBeInTheDocument();
    expect(inactiveLable).toBeNull();
  });

  it(`renders inactive message when isActive property is set to false`, () => {
    render(<StatusIndicator {...baseProps} isActive={false} />);

    const activLabel = screen.queryByText(baseProps.activLabel);
    const inactiveLable = screen.getByText(baseProps.inactiveLable);

    expect(activLabel).toBeNull();
    expect(inactiveLable).toBeInTheDocument();
  });
});
