import { Box } from '@chakra-ui/react';
import { TrackListProps } from '../types';
import { TrackRow } from './TrackRow';

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
          {tracks.map((track, index) => (
            <TrackRow
              key={`${track.name}-${index}`}
              track={track}
              index={index}
              albumName={albumName}
              artistName={artistName}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
