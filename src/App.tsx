import { useState } from 'react';
import { Button, Badge, Box, Flex, HStack } from '@chakra-ui/react';
import { Music, Search as SearchIcon, Heart } from 'lucide-react';
import { AlbumOverview } from './pages/AlbumOverview';
import { AlbumDetail } from './pages/AlbumDetail';
import { Search } from './pages/Search';
import { Favourites } from './pages/Favourites';
import { useStore } from './store/useStore';
import { View, AlbumView } from './types';

function App() {
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumView | null>(null);
  const { favourites } = useStore();

  const handleAlbumClick = (artist: string, album: string) => {
    setSelectedAlbum({ artist, album });
    setCurrentView('detail');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setSelectedAlbum(null);
  };

  return (
    <Box minH='100vh' bg='gray.50'>
      {/* Navigation Header */}
      <Box
        bg='white'
        borderBottom='1px'
        borderColor='gray.200'
        position='sticky'
        top={0}
        zIndex={10}
        shadow='sm'
      >
        <Flex
          maxW='container.xl'
          mx='auto'
          px={{ base: 4, md: 6 }}
          py={{ base: 3, md: 4 }}
          align='center'
          justify='space-between'
          gap={4}
        >
          <HStack gap={2} flexShrink={0}>
            <Music size={28} color='#319795' />
            <Box
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight='bold'
              color='teal.600'
              display={{ base: 'none', sm: 'block' }}
            >
              Artist Showcase
            </Box>
            <Box
              fontSize='xl'
              fontWeight='bold'
              color='teal.600'
              display={{ base: 'block', sm: 'none' }}
            >
              Music
            </Box>
          </HStack>

          <HStack gap={{ base: 1, md: 2 }} flexWrap='wrap' justify='flex-end'>
            <Button
              variant={currentView === 'overview' ? 'solid' : 'ghost'}
              colorScheme='teal'
              onClick={handleBackToOverview}
              size={{ base: 'sm', md: 'md' }}
              paddingX={{ base: '4px', md: '10px' }}
            >
              <Music size={18} />
              <Box display={{ base: 'none', sm: 'block' }}>Albums</Box>
            </Button>
            <Button
              variant={currentView === 'search' ? 'solid' : 'ghost'}
              colorScheme='teal'
              onClick={() => setCurrentView('search')}
              size={{ base: 'sm', md: 'md' }}
              paddingX={{ base: '4px', md: '10px' }}
            >
              <SearchIcon size={18} />
              <Box display={{ base: 'none', sm: 'block' }}>Search</Box>
            </Button>
            <Button
              variant={currentView === 'favourites' ? 'solid' : 'ghost'}
              colorScheme='teal'
              onClick={() => setCurrentView('favourites')}
              position='relative'
              size={{ base: 'sm', md: 'md' }}
              paddingX={{ base: '4px', md: '10px' }}
            >
              <Heart size={18} />
              <Box display={{ base: 'none', sm: 'block' }}>Favourites</Box>
              {favourites.length > 0 && (
                <Badge
                  colorScheme='red'
                  borderRadius='full'
                  position='absolute'
                  top='-1'
                  right='-1'
                  fontSize='xs'
                  px={2}
                  minW='20px'
                  textAlign='center'
                >
                  {favourites.length}
                </Badge>
              )}
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box minH='calc(100vh - 73px)'>
        {currentView === 'overview' && (
          <AlbumOverview onAlbumClick={handleAlbumClick} />
        )}
        {currentView === 'detail' && selectedAlbum && (
          <AlbumDetail
            artistName={selectedAlbum.artist}
            albumName={selectedAlbum.album}
            onBack={handleBackToOverview}
          />
        )}
        {currentView === 'search' && <Search onAlbumClick={handleAlbumClick} />}
        {currentView === 'favourites' && <Favourites />}
      </Box>
    </Box>
  );
}

export default App;
