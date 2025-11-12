import { useState, useEffect } from 'react';
import {
  Heading,
  Spinner,
  Image,
  Text,
  Button,
  Alert,
  Badge,
  Box,
  Container,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { lastfmAPI } from '../services/lastfm';
import { AlbumDetail as AlbumDetailType, AlbumDetailProps } from '../types';
import { TrackList } from '../components/TrackList';

/**
 * AlbumDetail Page
 *
 * Displays detailed information about a specific album including cover art, artist name,
 * play count, listener count, wiki information, and a complete track listing.
 * Users can navigate back to the album overview or add individual tracks to favourites.
 */
export const AlbumDetail = ({
  artistName,
  albumName,
  onBack,
}: AlbumDetailProps) => {
  const [album, setAlbum] = useState<AlbumDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbumDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await lastfmAPI.getAlbumInfo(artistName, albumName);
        setAlbum(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load album details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [artistName, albumName]);

  const getImageUrl = () => {
    if (!album?.image) return '';
    const largeImage = album.image.find((img) => img.size === 'extralarge');
    return (
      largeImage?.['#text'] ||
      album.image[album.image.length - 1]?.['#text'] ||
      ''
    );
  };

  const getArtistName = () => {
    if (!album) return '';
    return typeof album.artist === 'string' ? album.artist : album.artist.name;
  };

  if (loading) {
    return (
      <Container
        maxW='container.xl'
        py={{ base: 6, md: 8 }}
        px={{ base: 4, md: 6 }}
      >
        <VStack py={20} gap={4}>
          <Spinner size='xl' color='teal.500' />
          <Text color='gray.600'>Loading album details...</Text>
        </VStack>
      </Container>
    );
  }

  if (error || !album) {
    return (
      <Container
        maxW='container.xl'
        py={{ base: 6, md: 8 }}
        px={{ base: 4, md: 6 }}
      >
        <VStack gap={4}>
          <Button onClick={onBack} variant='ghost'>
            <ArrowLeft size={20} />
            Back to Albums
          </Button>
          <Alert.Root status='error' borderRadius='md'>
            <Alert.Indicator>
              <AlertCircle size={20} />
            </Alert.Indicator>
            <Alert.Title>{error || 'Album not found'}</Alert.Title>
          </Alert.Root>
        </VStack>
      </Container>
    );
  }

  return (
    <Container
      maxW='container.xl'
      py={{ base: 6, md: 8 }}
      px={{ base: 4, md: 6 }}
    >
      <VStack gap={6} align='stretch'>
        <Button onClick={onBack} variant='ghost' w='fit-content' size='lg'>
          <ArrowLeft size={20} />
          Back to Albums
        </Button>

        <HStack gap={8} align='start' flexWrap={{ base: 'wrap', md: 'nowrap' }}>
          <Box flexShrink={0}>
            <Image
              src={
                getImageUrl() ||
                'https://via.placeholder.com/300x300?text=No+Image'
              }
              alt={album.name}
              boxSize={{ base: '100%', md: '300px' }}
              objectFit='cover'
              borderRadius='lg'
              shadow='lg'
            />
          </Box>

          <VStack align='start' gap={4} flex={1}>
            <Box>
              <Heading size='2xl' mb={2}>
                {album.name}
              </Heading>
              <Text fontSize='xl' color='gray.600'>
                {getArtistName()}
              </Text>
            </Box>

            <HStack gap={4} flexWrap='wrap'>
              {album.playcount && (
                <Badge colorScheme='teal' fontSize='md' px={3} py={1}>
                  {parseInt(album.playcount).toLocaleString()} plays
                </Badge>
              )}
              {album.listeners && (
                <Badge colorScheme='blue' fontSize='md' px={3} py={1}>
                  {parseInt(album.listeners).toLocaleString()} listeners
                </Badge>
              )}
            </HStack>

            {album.wiki?.summary && (
              <Box>
                <Text
                  color='gray.700'
                  dangerouslySetInnerHTML={{
                    __html: album.wiki.summary.replace(/<a[^>]*>.*?<\/a>/g, ''),
                  }}
                />
              </Box>
            )}
          </VStack>
        </HStack>

        <Box borderTop='1px' borderColor='gray.200' />

        <Box>
          <Heading size='lg' mb={4}>
            Tracks
          </Heading>
          {album.tracks?.track && album.tracks.track.length > 0 ? (
            <TrackList
              tracks={album.tracks.track}
              albumName={album.name}
              artistName={getArtistName()}
            />
          ) : (
            <Text color='gray.500'>No tracks available for this album.</Text>
          )}
        </Box>
      </VStack>
    </Container>
  );
};
