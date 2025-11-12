import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Heading,
  Input,
  Button,
  Text,
  Spinner,
  Alert,
  IconButton,
  TabsRoot,
  TabsList,
  TabsContent,
  TabsContentGroup,
  TabsTrigger,
  Box,
  Container,
  VStack,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import { Search as SearchIcon, Heart, AlertCircle } from 'lucide-react';
import { lastfmAPI } from '../services/lastfm';
import { Album, Track, SearchProps } from '../types';
import { AlbumCard } from '../components/AlbumCard';
import { useStore } from '../store/useStore';

const ITEMS_PER_PAGE = 6;
const MAX_DISPLAY_ITEMS = 30; // Limit to prevent memory issues

export const Search = ({ onAlbumClick }: SearchProps) => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [displayedAlbumsCount, setDisplayedAlbumsCount] =
    useState(ITEMS_PER_PAGE);
  const [displayedTracksCount, setDisplayedTracksCount] =
    useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const albumsObserverTarget = useRef<HTMLDivElement>(null);
  const tracksObserverTarget = useRef<HTMLDivElement>(null);
  const albumsObserverRef = useRef<IntersectionObserver | null>(null);
  const tracksObserverRef = useRef<IntersectionObserver | null>(null);

  const { addFavourite, removeFavourite, isFavourite } = useStore();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const [trackResults, albumResults] = await Promise.all([
        lastfmAPI.searchTracks(query),
        lastfmAPI.searchAlbums(query),
      ]);

      // Limit results to prevent memory issues
      setTracks(trackResults.slice(0, MAX_DISPLAY_ITEMS));
      setAlbums(albumResults.slice(0, MAX_DISPLAY_ITEMS));
      setDisplayedTracksCount(ITEMS_PER_PAGE);
      setDisplayedAlbumsCount(ITEMS_PER_PAGE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setTracks([]);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedTracks = useMemo(() => {
    return tracks.slice(0, displayedTracksCount);
  }, [tracks, displayedTracksCount]);

  const displayedAlbums = useMemo(() => {
    return albums.slice(0, displayedAlbumsCount);
  }, [albums, displayedAlbumsCount]);

  const loadMoreTracks = useCallback(() => {
    if (displayedTracksCount < tracks.length) {
      setDisplayedTracksCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, tracks.length)
      );
    }
  }, [displayedTracksCount, tracks.length]);

  const loadMoreAlbums = useCallback(() => {
    if (displayedAlbumsCount < albums.length) {
      setDisplayedAlbumsCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, albums.length)
      );
    }
  }, [displayedAlbumsCount, albums.length]);

  // Intersection Observer for lazy loading albums
  useEffect(() => {
    // Cleanup previous observer
    if (albumsObserverRef.current) {
      albumsObserverRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreAlbums();
        }
      },
      { threshold: 0.1 }
    );

    albumsObserverRef.current = observer;

    const currentTarget = albumsObserverTarget.current;
    if (currentTarget && displayedAlbumsCount < albums.length) {
      observer.observe(currentTarget);
    }

    return () => {
      if (albumsObserverRef.current) {
        albumsObserverRef.current.disconnect();
      }
    };
  }, [loadMoreAlbums, loading, displayedAlbumsCount, albums.length]);

  // Intersection Observer for lazy loading tracks
  useEffect(() => {
    // Cleanup previous observer
    if (tracksObserverRef.current) {
      tracksObserverRef.current.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreTracks();
        }
      },
      { threshold: 0.1 }
    );

    tracksObserverRef.current = observer;

    const currentTarget = tracksObserverTarget.current;
    if (currentTarget && displayedTracksCount < tracks.length) {
      observer.observe(currentTarget);
    }

    return () => {
      if (tracksObserverRef.current) {
        tracksObserverRef.current.disconnect();
      }
    };
  }, [loadMoreTracks, loading, displayedTracksCount, tracks.length]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDuration = (seconds: string) => {
    const secs = parseInt(seconds);
    if (!secs || isNaN(secs)) return '-';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleToggleFavourite = (track: Track) => {
    const trackName = track.name;
    const artist = track.artist?.name || '';

    if (isFavourite(trackName, artist)) {
      removeFavourite(trackName, artist);
    } else {
      addFavourite({
        trackName,
        artistName: artist,
        albumName: track.album?.title || 'Unknown Album',
        duration: track.duration || '0',
        addedAt: Date.now(),
      });
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
            Search
          </Heading>
          <Text color='gray.600'>Search for tracks and albums</Text>
        </Box>

        <HStack gap={4}>
          <Input
            placeholder='Search for tracks or albums...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
            <SearchIcon size={20} />
            Search
          </Button>
        </HStack>

        {error && (
          <Alert.Root status='error' borderRadius='md'>
            <Alert.Indicator>
              <AlertCircle size={20} />
            </Alert.Indicator>
            <Alert.Title>{error}</Alert.Title>
          </Alert.Root>
        )}

        {loading && (
          <VStack py={20} gap={4}>
            <Spinner size='xl' color='teal.500' />
            <Text color='gray.600'>Searching...</Text>
          </VStack>
        )}

        {!loading && searched && (
          <TabsRoot defaultValue='tracks' variant='enclosed'>
            <TabsList>
              <TabsTrigger value='tracks'>Tracks ({tracks.length})</TabsTrigger>
              <TabsTrigger value='albums'>Albums ({albums.length})</TabsTrigger>
            </TabsList>

            <TabsContentGroup>
              <TabsContent value='tracks' px={0}>
                {tracks.length > 0 ? (
                  <>
                    <Box overflowX='auto' borderWidth='1px' borderRadius='lg'>
                      <Box
                        as='table'
                        width='100%'
                        style={{ borderCollapse: 'collapse' }}
                      >
                        <Box as='thead' bg='gray.50'>
                          <Box as='tr'>
                            <Box
                              as='th'
                              p={3}
                              textAlign='left'
                              fontSize='sm'
                              fontWeight='semibold'
                              color='gray.600'
                            >
                              Track Name
                            </Box>
                            <Box
                              as='th'
                              p={3}
                              textAlign='left'
                              fontSize='sm'
                              fontWeight='semibold'
                              color='gray.600'
                            >
                              Artist
                            </Box>
                            <Box
                              as='th'
                              w='100px'
                              p={3}
                              textAlign='left'
                              fontSize='sm'
                              fontWeight='semibold'
                              color='gray.600'
                            >
                              Duration
                            </Box>
                            <Box
                              as='th'
                              w='80px'
                              p={3}
                              textAlign='center'
                              fontSize='sm'
                              fontWeight='semibold'
                              color='gray.600'
                            >
                              Favourite
                            </Box>
                          </Box>
                        </Box>
                        <Box as='tbody'>
                          {displayedTracks.map((track, index) => {
                            const isFav = isFavourite(
                              track.name,
                              track.artist?.name || ''
                            );

                            return (
                              <Box
                                as='tr'
                                key={`${track.name}-${index}`}
                                _hover={{ bg: 'gray.50' }}
                              >
                                <Box as='td' p={3}>
                                  <Text fontWeight='medium'>{track.name}</Text>
                                </Box>
                                <Box as='td' p={3}>
                                  <Text color='gray.600'>
                                    {track.artist?.name}
                                  </Text>
                                </Box>
                                <Box as='td' p={3}>
                                  <Text color='gray.600'>
                                    {formatDuration(track.duration)}
                                  </Text>
                                </Box>
                                <Box as='td' p={3} textAlign='center'>
                                  <IconButton
                                    aria-label='Toggle favourite'
                                    variant='ghost'
                                    colorScheme={isFav ? 'red' : 'gray'}
                                    size='sm'
                                    onClick={() => handleToggleFavourite(track)}
                                  >
                                    <Heart
                                      size={18}
                                      fill={isFav ? 'currentColor' : 'none'}
                                    />
                                  </IconButton>
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    </Box>

                    {/* Intersection Observer Target for Tracks */}
                    {displayedTracksCount < tracks.length && (
                      <Box ref={tracksObserverTarget} py={8} textAlign='center'>
                        <Spinner size='lg' color='teal.500' />
                        <Text color='gray.600' mt={2}>
                          Loading more tracks...
                        </Text>
                      </Box>
                    )}

                    {displayedTracksCount >= tracks.length &&
                      tracks.length > ITEMS_PER_PAGE && (
                        <Text textAlign='center' color='gray.500' py={4}>
                          Showing all {tracks.length} tracks
                        </Text>
                      )}
                  </>
                ) : (
                  <Text color='gray.500' py={10} textAlign='center'>
                    No tracks found for "{query}"
                  </Text>
                )}
              </TabsContent>

              <TabsContent value='albums' px={0}>
                {albums.length > 0 ? (
                  <>
                    <SimpleGrid
                      columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                      gap={6}
                    >
                      {displayedAlbums.map((album, index) => (
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

                    {/* Intersection Observer Target for Albums */}
                    {displayedAlbumsCount < albums.length && (
                      <Box ref={albumsObserverTarget} py={8} textAlign='center'>
                        <Spinner size='lg' color='teal.500' />
                        <Text color='gray.600' mt={2}>
                          Loading more albums...
                        </Text>
                      </Box>
                    )}

                    {displayedAlbumsCount >= albums.length &&
                      albums.length > ITEMS_PER_PAGE && (
                        <Text textAlign='center' color='gray.500' py={4}>
                          Showing all {albums.length} albums
                        </Text>
                      )}
                  </>
                ) : (
                  <Text color='gray.500' py={10} textAlign='center'>
                    No albums found for "{query}"
                  </Text>
                )}
              </TabsContent>
            </TabsContentGroup>
          </TabsRoot>
        )}

        {!loading && !searched && (
          <VStack py={20}>
            <SearchIcon size={48} color='gray' />
            <Text color='gray.500' fontSize='lg'>
              Enter a search query to find tracks and albums
            </Text>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};
