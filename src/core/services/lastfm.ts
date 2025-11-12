import axios from 'axios';
import { Album, AlbumDetail, Track } from '../types';

const API_KEY = import.meta.env.VITE_LASTFM_API_KEY;
const BASE_URL = import.meta.env.VITE_LASTFM_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    format: 'json',
  },
});

export const lastfmAPI = {
  /**
   * Fetches top chart albums from Last.fm using the 'rock' tag
   *
   * @param page - The page number for pagination (default: 1)
   * @param limit - The number of albums to fetch per page (default: 8)
   * @returns Promise<Album[]> - Array of top chart albums
   * @throws Error if the API request fails
   */
  async getTopChartAlbums(
    page: number = 1,
    limit: number = 8
  ): Promise<Album[]> {
    try {
      const response = await api.get('', {
        params: {
          method: 'tag.gettopalbums',
          tag: 'rock',
          limit,
          page,
        },
      });

      return response.data.albums?.album || response.data.album || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
      }
      throw new Error('Failed to fetch top albums');
    }
  },

  /**
   * Fetches top albums for a specific artist from Last.fm
   *
   * @param artistName - The name of the artist to search for
   * @param page - The page number for pagination (default: 1)
   * @param limit - The number of albums to fetch per page (default: 8)
   * @returns Promise<Album[]> - Array of the artist's top albums
   * @throws Error if the API request fails
   */
  async getArtistTopAlbums(
    artistName: string,
    page: number = 1,
    limit: number = 8
  ): Promise<Album[]> {
    try {
      const response = await api.get('', {
        params: {
          method: 'artist.gettopalbums',
          artist: artistName,
          limit,
          page,
        },
      });
      return response.data.topalbums?.album || [];
    } catch (error) {
      throw new Error('Failed to fetch artist albums');
    }
  },

  /**
   * Fetches detailed information about a specific album from Last.fm
   *
   * @param artistName - The name of the artist
   * @param albumName - The name of the album
   * @returns Promise<AlbumDetail> - Detailed album information including tracks, playcount, and wiki
   * @throws Error if the API request fails
   */
  async getAlbumInfo(
    artistName: string,
    albumName: string
  ): Promise<AlbumDetail> {
    try {
      const response = await api.get('', {
        params: {
          method: 'album.getinfo',
          artist: artistName,
          album: albumName,
        },
      });
      return response.data.album;
    } catch (error) {
      throw new Error('Failed to fetch album information');
    }
  },

  /**
   * Searches for tracks on Last.fm based on a query string
   *
   * @param query - The search term to find matching tracks
   * @returns Promise<Track[]> - Array of tracks matching the search query (max 30)
   * @throws Error if the API request fails
   */
  async searchTracks(query: string): Promise<Track[]> {
    try {
      const response = await api.get('', {
        params: {
          method: 'track.search',
          track: query,
          limit: 30,
        },
      });
      return response.data.results?.trackmatches?.track || [];
    } catch (error) {
      throw new Error('Failed to search tracks');
    }
  },

  /**
   * Searches for albums on Last.fm based on a query string
   *
   * @param query - The search term to find matching albums
   * @returns Promise<Album[]> - Array of albums matching the search query (max 30)
   * @throws Error if the API request fails
   */
  async searchAlbums(query: string): Promise<Album[]> {
    try {
      const response = await api.get('', {
        params: {
          method: 'album.search',
          album: query,
          limit: 30,
        },
      });
      return response.data.results?.albummatches?.album || [];
    } catch (error) {
      throw new Error('Failed to search albums');
    }
  },
};
