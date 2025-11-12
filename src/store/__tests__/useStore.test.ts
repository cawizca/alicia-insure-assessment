import { renderHook, act } from '@testing-library/react';
import { useStore } from '../useStore';

describe('useStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useStore());
    act(() => {
      result.current.favourites.forEach((fav) => {
        result.current.removeFavourite(fav.trackName, fav.artistName);
      });
    });
  });

  it('should initialize with empty favourites', () => {
    const { result } = renderHook(() => useStore());
    expect(result.current.favourites).toEqual([]);
  });

  it('should add a favourite', () => {
    const { result } = renderHook(() => useStore());

    const favourite = {
      trackName: 'Test Track',
      artistName: 'Test Artist',
      albumName: 'Test Album',
      duration: '180',
      addedAt: Date.now(),
    };

    act(() => {
      result.current.addFavourite(favourite);
    });

    expect(result.current.favourites).toHaveLength(1);
    expect(result.current.favourites[0]).toEqual(favourite);
  });

  it('should remove a favourite', () => {
    const { result } = renderHook(() => useStore());

    const favourite = {
      trackName: 'Test Track',
      artistName: 'Test Artist',
      albumName: 'Test Album',
      duration: '180',
      addedAt: Date.now(),
    };

    act(() => {
      result.current.addFavourite(favourite);
    });

    expect(result.current.favourites).toHaveLength(1);

    act(() => {
      result.current.removeFavourite('Test Track', 'Test Artist');
    });

    expect(result.current.favourites).toHaveLength(0);
  });

  it('should check if track is favourite', () => {
    const { result } = renderHook(() => useStore());

    const favourite = {
      trackName: 'Test Track',
      artistName: 'Test Artist',
      albumName: 'Test Album',
      duration: '180',
      addedAt: Date.now(),
    };

    expect(result.current.isFavourite('Test Track', 'Test Artist')).toBe(false);

    act(() => {
      result.current.addFavourite(favourite);
    });

    expect(result.current.isFavourite('Test Track', 'Test Artist')).toBe(true);
  });

  it('should not add duplicate favourites', () => {
    const { result } = renderHook(() => useStore());

    const favourite = {
      trackName: 'Test Track',
      artistName: 'Test Artist',
      albumName: 'Test Album',
      duration: '180',
      addedAt: Date.now(),
    };

    act(() => {
      result.current.addFavourite(favourite);
      result.current.addFavourite(favourite);
    });

    expect(result.current.favourites).toHaveLength(1);
  });
});
