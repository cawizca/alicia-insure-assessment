import { IconButton, Text, Badge, Box } from '@chakra-ui/react';
import { Heart } from 'lucide-react';
import { FavouriteRowProps } from '../../../core/types';
import { useStore } from '../../../core/store';

/**
 * FavouriteRow Component
 *
 * Displays a single favourite track row in the favourites table.
 * Shows track name, artist, album, duration, date added, and a remove button.
 * Handles removing the track from favourites when the heart icon is clicked.
 */
export const FavouriteRow = ({ favourite, index }: FavouriteRowProps) => {
  const { removeFavourite } = useStore();

  const formatDuration = (seconds: string) => {
    const secs = parseInt(seconds);
    if (!secs || isNaN(secs)) return '-';
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Box
      as='tr'
      key={`${favourite.trackName}-${index}`}
      _hover={{ bg: 'gray.50' }}
    >
      <Box as='td' p={3}>
        <Text fontWeight='medium'>{favourite.trackName}</Text>
      </Box>
      <Box as='td' p={3}>
        <Text color='gray.600'>{favourite.artistName}</Text>
      </Box>
      <Box as='td' p={3}>
        <Text color='gray.600' fontSize='sm'>
          {favourite.albumName}
        </Text>
      </Box>
      <Box as='td' p={3}>
        <Badge colorScheme='teal' variant='subtle'>
          {formatDuration(favourite.duration)}
        </Badge>
      </Box>
      <Box as='td' p={3}>
        <Text fontSize='sm' color='gray.500'>
          {formatDate(favourite.addedAt)}
        </Text>
      </Box>
      <Box as='td' p={3} textAlign='center'>
        <IconButton
          aria-label='Remove favourite'
          variant='ghost'
          colorScheme='red'
          size='sm'
          onClick={() =>
            removeFavourite(favourite.trackName, favourite.artistName)
          }
        >
          <Heart size={18} fill='currentColor' />
        </IconButton>
      </Box>
    </Box>
  );
};
