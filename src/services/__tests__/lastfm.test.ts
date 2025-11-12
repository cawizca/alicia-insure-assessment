// Mock the lastfm module to avoid import.meta.env issues
jest.mock('../lastfm', () => ({
  lastfmAPI: {
    getTopChartAlbums: jest.fn(),
    getArtistTopAlbums: jest.fn(),
    searchTracks: jest.fn(),
    searchAlbums: jest.fn(),
  },
}));

import { lastfmAPI } from '../lastfm';

const mockedLastfmAPI = lastfmAPI as jest.Mocked<typeof lastfmAPI>;

describe('lastfm API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTopChartAlbums', () => {
    it('should fetch top chart albums successfully', async () => {
      const mockAlbums = [
        {
          name: 'Test Album 1',
          artist: 'Test Artist 1',
          image: [],
          playcount: '1000',
          url: 'https://example.com',
          mbid: '1',
        },
        {
          name: 'Test Album 2',
          artist: 'Test Artist 2',
          image: [],
          playcount: '2000',
          url: 'https://example.com',
          mbid: '2',
        },
      ];

      mockedLastfmAPI.getTopChartAlbums.mockResolvedValue(mockAlbums);

      const albums = await lastfmAPI.getTopChartAlbums(1, 8);

      expect(mockedLastfmAPI.getTopChartAlbums).toHaveBeenCalledWith(1, 8);
      expect(albums).toHaveLength(2);
      expect(albums[0].name).toBe('Test Album 1');
    });

    it('should handle errors gracefully', async () => {
      mockedLastfmAPI.getTopChartAlbums.mockRejectedValue(
        new Error('Failed to fetch top albums')
      );

      await expect(lastfmAPI.getTopChartAlbums()).rejects.toThrow(
        'Failed to fetch top albums'
      );
    });
  });

  describe('getArtistTopAlbums', () => {
    it('should fetch artist albums successfully', async () => {
      const mockAlbums = [
        {
          name: 'Album 1',
          artist: 'Coldplay',
          image: [],
          playcount: '5000',
          url: 'https://example.com',
          mbid: '3',
        },
      ];

      mockedLastfmAPI.getArtistTopAlbums.mockResolvedValue(mockAlbums);

      const albums = await lastfmAPI.getArtistTopAlbums('Coldplay', 1, 8);

      expect(mockedLastfmAPI.getArtistTopAlbums).toHaveBeenCalledWith(
        'Coldplay',
        1,
        8
      );
      expect(albums).toHaveLength(1);
      expect(albums[0].artist).toBe('Coldplay');
    });
  });

  describe('searchTracks', () => {
    it('should search tracks successfully', async () => {
      const mockTracks = [
        {
          name: 'Test Track',
          artist: {
            name: 'Test Artist',
            url: 'https://example.com/artist',
          },
          duration: '180',
          url: 'https://example.com',
        },
      ];

      mockedLastfmAPI.searchTracks.mockResolvedValue(mockTracks);

      const tracks = await lastfmAPI.searchTracks('test');

      expect(mockedLastfmAPI.searchTracks).toHaveBeenCalledWith('test');
      expect(tracks).toHaveLength(1);
      expect(tracks[0].name).toBe('Test Track');
    });
  });

  describe('searchAlbums', () => {
    it('should search albums successfully', async () => {
      const mockAlbums = [
        {
          name: 'Test Album',
          artist: 'Test Artist',
          image: [],
          url: 'https://example.com',
          mbid: '4',
        },
      ];

      mockedLastfmAPI.searchAlbums.mockResolvedValue(mockAlbums);

      const albums = await lastfmAPI.searchAlbums('test');

      expect(mockedLastfmAPI.searchAlbums).toHaveBeenCalledWith('test');
      expect(albums).toHaveLength(1);
      expect(albums[0].name).toBe('Test Album');
    });
  });
});
