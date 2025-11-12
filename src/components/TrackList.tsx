import { IconButton, Text, Box } from '@chakra-ui/react';
import { Heart } from 'lucide-react';
import { Track, TrackListProps } from '../types';
import { useStore } from '../store/useStore';

/**
 * TrackList Component
 *
 * Displays a table of tracks from an album with track number, name, duration, and favourite toggle.
 * Allows users to add/remove tracks to/from their favourites list.
 * Integrates with Zustand store for favourites management.
 */
export const TrackList = ({
  tracks,
  albumName,
  artistName,
}: TrackListProps) => {
  const { addFavourite, removeFavourite, isFavourite } = useStore();

  const formatDuration = (seconds: string) => {
    const secs = parseInt(seconds);
    if (!secs || isNaN(secs)) return '-';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleToggleFavourite = (track: Track) => {
    const trackName = track.name;
    const artist = track.artist?.name || artistName;

    if (isFavourite(trackName, artist)) {
      removeFavourite(trackName, artist);
    } else {
      addFavourite({
        trackName,
        artistName: artist,
        albumName,
        duration: track.duration,
        addedAt: Date.now(),
      });
    }
  };

  return (
    <Box overflowX='auto' borderWidth='1px' borderRadius='lg'>
      <Box as='table' width='100%' style={{ borderCollapse: 'collapse' }}>
        <Box as='thead' bg='gray.50'>
          <Box as='tr'>
            <Box
              as='th'
              w='50px'
              p={3}
              textAlign='left'
              fontSize='sm'
              fontWeight='semibold'
              color='gray.600'
            >
              #
            </Box>
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
          {tracks.map((track, index) => {
            const trackName = track.name;
            const artist = track.artist?.name || artistName;
            const isFav = isFavourite(trackName, artist);

            return (
              <Box
                as='tr'
                key={`${track.name}-${index}`}
                _hover={{ bg: 'gray.50' }}
                transition='background 0.2s'
              >
                <Box as='td' p={3}>
                  <Text color='gray.600' fontWeight='medium'>
                    {track['@attr']?.rank || index + 1}
                  </Text>
                </Box>
                <Box as='td' p={3}>
                  <Text fontWeight='medium'>{track.name}</Text>
                </Box>
                <Box as='td' p={3}>
                  <Text color='gray.600'>{formatDuration(track.duration)}</Text>
                </Box>
                <Box as='td' p={3} textAlign='center'>
                  <IconButton
                    aria-label='Toggle favourite'
                    variant='ghost'
                    colorScheme={isFav ? 'red' : 'gray'}
                    size='sm'
                    onClick={() => handleToggleFavourite(track)}
                  >
                    <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
