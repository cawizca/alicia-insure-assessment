import { IconButton, Text, Box } from '@chakra-ui/react';
import { Heart } from 'lucide-react';
import { SearchTrackRowProps } from '../types';
import { useStore } from '../store/useStore';

/**
 * SearchTrackRow Component
 *
 * Displays a single track row in the search results table.
 * Shows track name, artist, duration, and a favourite toggle button.
 * Handles adding/removing the track from favourites.
 */
export const SearchTrackRow = ({ track, index }: SearchTrackRowProps) => {
  const { addFavourite, removeFavourite, isFavourite } = useStore();

  const isFav = isFavourite(track.name, track.artist?.name || '');

  const formatDuration = (seconds: string) => {
    const secs = parseInt(seconds);
    if (!secs || isNaN(secs)) return '-';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleToggleFavourite = () => {
    const trackName = track.name;
    const artist = track.artist?.name || '';

    if (isFav) {
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
    <Box as='tr' key={`${track.name}-${index}`} _hover={{ bg: 'gray.50' }}>
      <Box as='td' p={3}>
        <Text fontWeight='medium'>{track.name}</Text>
      </Box>
      <Box as='td' p={3}>
        <Text color='gray.600'>{track.artist?.name}</Text>
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
          onClick={handleToggleFavourite}
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </IconButton>
      </Box>
    </Box>
  );
};
