import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Heading,
  Spinner,
  Text,
  Input,
  Button,
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Alert,
} from '@chakra-ui/react';
import { AlertCircle } from 'lucide-react';
import { lastfmAPI } from '../services/lastfm';
import { Album, SortOption, AlbumOverviewProps } from '../types';
import { AlbumCard } from '../components/AlbumCard';

/**
 * AlbumOverview Page
 *
 * Main landing page that displays top chart albums from Last.fm.
 * Features artist search functionality, sorting options, and infinite scroll pagination.
 * Shows either top chart albums (random rock albums) or search results for specific artists.
 * Implements memory optimization with album count limits and proper observer cleanup.
 */

const ITEMS_PER_PAGE = 8;

export const AlbumOverview = ({ onAlbumClick }: AlbumOverviewProps) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchMode, setSearchMode] = useState(false); // Track if showing search results or charts
  const [artistName, setArtistName] = useState('');
  const observerTarget = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch top chart albums (random albums from various artists)
  const fetchTopCharts = useCallback(
    async (page: number = 1) => {
      if (page === 1) {
        setLoading(true);
        setAlbums([]);
        setCurrentPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      try {
        const data = await lastfmAPI.getTopChartAlbums(page, ITEMS_PER_PAGE);

        if (page === 1) {
          setAlbums(data);
        } else {
          setAlbums((prev) => {
            const newAlbums = [...prev, ...data];
            return newAlbums;
          });
        }

        // Stop loading more if we've hit the limit or no more data
        setHasMore(data.length === ITEMS_PER_PAGE);
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load albums');
        if (page === 1) {
          setAlbums([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [albums.length]
  );

  // Fetch albums by artist (when searching)
  const fetchAlbumsByArtist = useCallback(
    async (artist: string, page: number = 1) => {
      if (!artist.trim()) return;

      if (page === 1) {
        setLoading(true);
        setAlbums([]);
        setCurrentPage(1);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      try {
        const data = await lastfmAPI.getArtistTopAlbums(
          artist,
          page,
          ITEMS_PER_PAGE
        );

        if (page === 1) {
          setAlbums(data);
          setArtistName(artist);
        } else {
          setAlbums((prev) => {
            const newAlbums = [...prev, ...data];
            return newAlbums;
          });
        }

        setHasMore(data.length === ITEMS_PER_PAGE);
        setCurrentPage(page);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load albums');
        if (page === 1) {
          setAlbums([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [albums.length]
  );

  useEffect(() => {
    // Fetch top chart albums on initial load
    fetchTopCharts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedAlbums = useMemo(() => {
    const sorted = [...albums];

    switch (sortOption) {
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'year-asc':
        return sorted.sort(
          (a, b) => parseInt(a.playcount || '0') - parseInt(b.playcount || '0')
        );
      case 'year-desc':
        return sorted.sort(
          (a, b) => parseInt(b.playcount || '0') - parseInt(a.playcount || '0')
        );
      default:
        return sorted;
    }
  }, [albums, sortOption]);

  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      if (searchMode && artistName) {
        fetchAlbumsByArtist(artistName, currentPage + 1);
      } else {
        fetchTopCharts(currentPage + 1);
      }
    }
  }, [
    hasMore,
    loadingMore,
    loading,
    searchMode,
    artistName,
    currentPage,
    fetchTopCharts,
    fetchAlbumsByArtist,
  ]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    // Cleanup previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    const currentTarget = observerTarget.current;
    if (currentTarget && hasMore) {
      observer.observe(currentTarget);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchMode(true);
      setArtistName(searchInput);
      fetchAlbumsByArtist(searchInput);
    }
  };

  const handleClearSearch = () => {
    setSearchMode(false);
    setSearchInput('');
    setArtistName('');
    fetchTopCharts();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container
      maxW='container.xl'
      py={{ base: 6, md: 8 }}
      px={{ base: 4, md: 6 }}
    >
      <VStack gap={6} align='stretch'>
        <Box>
          <Heading size='xl' mb={2}>
            Album Showcase
          </Heading>
          <Text color='gray.600'>
            {searchMode && artistName
              ? `Showing albums by ${artistName}`
              : 'Discover popular albums from various artists'}
          </Text>
        </Box>

        <HStack gap={4}>
          <Input
            placeholder='Search for a specific artist...'
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            size='lg'
            paddingX={{ base: '4px', md: '10px' }}
          />
          <Button
            colorScheme='teal'
            onClick={handleSearch}
            loading={loading}
            size='lg'
            minW='120px'
          >
            Search
          </Button>
          {searchMode && (
            <Button
              variant='outline'
              colorScheme='teal'
              onClick={handleClearSearch}
              size='lg'
              minW='120px'
            >
              Clear
            </Button>
          )}
        </HStack>

        {!loading && albums.length > 0 && (
          <HStack justify='space-between' align='center'>
            <Text fontSize='lg' fontWeight='semibold'>
              {searchMode && artistName
                ? `${albums.length} albums by ${artistName}`
                : `${albums.length} popular albums`}
            </Text>
            <HStack>
              <Text fontSize='sm' color='gray.600'>
                Sort by:
              </Text>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                style={{
                  width: '200px',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #d1d5db',
                  cursor: 'pointer',
                }}
              >
                <option value='name-asc'>Name (A-Z)</option>
                <option value='name-desc'>Name (Z-A)</option>
                <option value='year-desc'>Most Played</option>
                <option value='year-asc'>Least Played</option>
              </select>
            </HStack>
          </HStack>
        )}

        {error && (
          <Alert.Root status='error' borderRadius='md'>
            <Alert.Indicator>
              <AlertCircle size={20} />
            </Alert.Indicator>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}

        {loading ? (
          <VStack py={20} gap={4}>
            <Spinner size='xl' color='teal.500' />
            <Text color='gray.600'>Loading albums...</Text>
          </VStack>
        ) : sortedAlbums.length > 0 ? (
          <>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6}>
              {sortedAlbums.map((album, index) => (
                <AlbumCard
                  key={`${album.name}-${index}`}
                  album={album}
                  onClick={() =>
                    onAlbumClick(
                      typeof album.artist === 'string'
                        ? album.artist
                        : album.artist.name,
                      album.name
                    )
                  }
                />
              ))}
            </SimpleGrid>

            {/* Intersection Observer Target */}
            {hasMore && (
              <Box ref={observerTarget} py={8} textAlign='center'>
                <Spinner size='lg' color='teal.500' />
                <Text color='gray.600' mt={2}>
                  Loading more albums...
                </Text>
              </Box>
            )}

            {/* Show count when all loaded */}
            {!hasMore && albums.length > 0 && (
              <Text textAlign='center' color='gray.500' py={4}>
                Showing all {albums.length} albums
              </Text>
            )}
          </>
        ) : (
          !error &&
          !loading && (
            <VStack py={20}>
              <Text color='gray.500' fontSize='lg'>
                Enter an artist name to discover their albums
              </Text>
            </VStack>
          )
        )}
      </VStack>
    </Container>
  );
};
