import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { AlbumCard } from '../AlbumCard';
import { Album } from '../../../../core/types';

// Helper to wrap components with ChakraProvider
const renderWithChakra = (component: React.ReactElement) => {
  return render(
    <ChakraProvider value={defaultSystem}>{component}</ChakraProvider>
  );
};

describe('AlbumCard', () => {
  const mockAlbum: Album = {
    name: 'Test Album',
    artist: 'Test Artist',
    image: [
      { '#text': '', size: 'small' },
      { '#text': '', size: 'medium' },
      { '#text': 'https://example.com/image.jpg', size: 'large' },
      { '#text': '', size: 'extralarge' },
    ],
    playcount: '1000',
    url: 'https://example.com',
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders album name and artist', () => {
    renderWithChakra(<AlbumCard album={mockAlbum} onClick={mockOnClick} />);

    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('renders album image', () => {
    renderWithChakra(<AlbumCard album={mockAlbum} onClick={mockOnClick} />);

    const image = screen.getByRole('img', { name: 'Test Album' });
    expect(image).toBeInTheDocument();
  });

  it('displays playcount when available', () => {
    renderWithChakra(<AlbumCard album={mockAlbum} onClick={mockOnClick} />);

    expect(screen.getByText(/1,000 plays/i)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    renderWithChakra(<AlbumCard album={mockAlbum} onClick={mockOnClick} />);

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('handles artist object format', () => {
    const albumWithArtistObject: Album = {
      ...mockAlbum,
      artist: {
        name: 'Object Artist',
        mbid: '123',
        url: 'https://example.com',
      },
    };

    renderWithChakra(
      <AlbumCard album={albumWithArtistObject} onClick={mockOnClick} />
    );

    expect(screen.getByText('Object Artist')).toBeInTheDocument();
  });

  it('shows placeholder image when no image available', () => {
    const albumWithoutImage: Album = {
      ...mockAlbum,
      image: [],
    };

    renderWithChakra(
      <AlbumCard album={albumWithoutImage} onClick={mockOnClick} />
    );

    const image = screen.getByRole('img', { name: 'Test Album' });
    expect(image).toHaveAttribute('src', expect.stringContaining('placehold'));
  });
});
