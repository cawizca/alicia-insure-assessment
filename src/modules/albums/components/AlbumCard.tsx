import { Image, Text, Badge, Box, VStack } from '@chakra-ui/react';
import { AlbumCardProps } from '../../../core/types';

/**
 * AlbumCard Component
 *
 * Displays an individual album card with cover image, album name, artist name, and play count.
 * Features hover effects and click handling for navigation to album details.
 * Uses optimized image loading (lazy loading) to improve performance.
 */
export const AlbumCard = ({ album, onClick }: AlbumCardProps) => {
  const getImageUrl = () => {
    // Prefer medium or large images to reduce memory usage
    const mediumImage = album.image?.find((img) => img.size === 'large');
    const fallbackImage = album.image?.find((img) => img.size === 'medium');
    return (
      mediumImage?.['#text'] ||
      fallbackImage?.['#text'] ||
      album.image?.[album.image.length - 1]?.['#text'] ||
      ''
    );
  };

  const getArtistName = () => {
    return typeof album.artist === 'string' ? album.artist : album.artist.name;
  };

  return (
    <Box
      role='article'
      borderWidth='1px'
      borderRadius='lg'
      overflow='hidden'
      cursor='pointer'
      onClick={onClick}
      transition='all 0.3s'
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'xl',
        borderColor: 'teal.400',
      }}
      bg='white'
    >
      <Image
        src={getImageUrl() || 'https://placehold.co/600x400?text=No+Image'}
        alt={album.name}
        objectFit='cover'
        w='100%'
        h='250px'
        loading='lazy'
        decoding='async'
      />
      <VStack align='stretch' p={4} gap={2}>
        <Text fontWeight='bold' fontSize='md' lineClamp={2} minH='48px'>
          {album.name}
        </Text>
        <Text fontSize='sm' color='gray.600' lineClamp={1}>
          {getArtistName()}
        </Text>
        {album.playcount && (
          <Badge colorScheme='teal' fontSize='xs' w='fit-content'>
            {parseInt(album.playcount).toLocaleString()} plays
          </Badge>
        )}
      </VStack>
    </Box>
  );
};
