import { IconButton, Text, Box } from '@chakra-ui/react';
import { Heart } from 'lucide-react';
import { TrackRowProps } from '../types';
import { useStore } from '../store/useStore';

/**
 * TrackRow Component
 *
 * Displays a single track row in the track list table.
 * Shows track number, name, duration, and a favourite toggle button.
 * Handles adding/removing the track from favourites.
 */
export const TrackRow = ({
  track,
  index,
  albumName,
  artistName,
}: TrackRowProps) => {
  const { addFavourite, removeFavourite, isFavourite } = useStore();

  const trackName = track.name;
  const artist = track.artist?.name || artistName;
  const isFav = isFavourite(trackName, artist);

  const formatDuration = (seconds: string) => {
    const secs = parseInt(seconds);
    if (!secs || isNaN(secs)) return '-';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleToggleFavourite = () => {
    if (isFav) {
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
          onClick={handleToggleFavourite}
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </IconButton>
      </Box>
    </Box>
  );
};
