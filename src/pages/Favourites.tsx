import { useState, useMemo } from 'react';
import {
  Heading,
  Text,
  Input,
  Box,
  Container,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { Heart, Search as SearchIcon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FavouriteRow } from '../components/FavouriteRow';

/**
 * Favourites Page
 *
 * Displays a list of user's favourite tracks saved from album details or search results.
 * Features search/filter functionality to find specific favourites by track, artist, or album name.
 * Shows track details including duration, album, artist, and when it was added.
 * Allows users to remove tracks from favourites. Data persists in localStorage via Zustand.
 */
export const Favourites = () => {
  const { favourites } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFavourites = useMemo(() => {
    if (!searchQuery.trim()) return favourites;

    const query = searchQuery.toLowerCase();
    return favourites.filter(
      (fav) =>
        fav.trackName.toLowerCase().includes(query) ||
        fav.artistName.toLowerCase().includes(query) ||
        fav.albumName.toLowerCase().includes(query)
    );
  }, [favourites, searchQuery]);

  return (
    <Container
      maxW='container.xl'
      py={{ base: 6, md: 8 }}
      px={{ base: 4, md: 6 }}
    >
      <VStack gap={6} align='stretch'>
        <Box>
          <Heading size='xl' mb={2}>
            Favourites
          </Heading>
          <Text color='gray.600'>
            {favourites.length} favourite{' '}
            {favourites.length === 1 ? 'track' : 'tracks'}
          </Text>
        </Box>

        {favourites.length > 0 && (
          <HStack>
            <SearchIcon size={20} color='gray' />
            <Input
              placeholder='Search favourites...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size='lg'
            />
          </HStack>
        )}

        {filteredFavourites.length > 0 ? (
          <Box overflowX='auto' borderWidth='1px' borderRadius='lg'>
            <Box as='table' width='100%' style={{ borderCollapse: 'collapse' }}>
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
                    Track
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
                    p={3}
                    textAlign='left'
                    fontSize='sm'
                    fontWeight='semibold'
                    color='gray.600'
                  >
                    Album
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
                    w='120px'
                    p={3}
                    textAlign='left'
                    fontSize='sm'
                    fontWeight='semibold'
                    color='gray.600'
                  >
                    Added
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
                    Remove
                  </Box>
                </Box>
              </Box>
              <Box as='tbody'>
                {filteredFavourites.map((favourite, index) => (
                  <FavouriteRow
                    key={`${favourite.trackName}-${index}`}
                    favourite={favourite}
                    index={index}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ) : favourites.length > 0 ? (
          <VStack py={20}>
            <Text color='gray.500' fontSize='lg'>
              No favourites match "{searchQuery}"
            </Text>
          </VStack>
        ) : (
          <VStack py={20}>
            <Heart size={48} color='gray' />
            <Text color='gray.500' fontSize='lg'>
              No favourite tracks yet
            </Text>
            <Text color='gray.400' textAlign='center'>
              Start adding tracks to your favourites from album details or
              search results
            </Text>
          </VStack>
        )}
      </VStack>
    </Container>
  );
};
