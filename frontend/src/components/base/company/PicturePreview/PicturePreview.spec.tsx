import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PicturePreview } from './PicturePreview';

const ALT = 'Podgląd zdjęcia';
const IMAGE = '/old-image.png';
const SRC = '/new-image.jpg';

const PROPS = {
  alt: ALT,
  image: IMAGE,
  width: '200px',
  height: '200px',
};

describe('PicturePreview', () => {
  it('renders image with provided value', () => {
    render(<PicturePreview {...PROPS} />);

    const picturePreview = screen.getByAltText(new RegExp(ALT, 'i'));

    expect(picturePreview).toBeInTheDocument();
    expect(picturePreview).toHaveAttribute('src', IMAGE);
  });

  it('render image with "src" value when both "image" and "src" properties are provided', () => {
    render(<PicturePreview {...PROPS} src={SRC} />);

    const picturePreview = screen.getByAltText(new RegExp(ALT, 'i'));

    expect(picturePreview).toBeInTheDocument();
    expect(picturePreview).toHaveAttribute('src', SRC);
  });
});
