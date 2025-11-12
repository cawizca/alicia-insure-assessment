// Data Models
export interface Album {
  name: string;
  artist: string | { name: string; mbid?: string; url?: string };
  image: Array<{ '#text': string; size: string }>;
  playcount?: string;
  url?: string;
  mbid?: string;
}

export interface Track {
  name: string;
  duration: string;
  url?: string;
  playcount?: string;
  artist?: {
    name: string;
    url?: string;
  };
  album?: {
    title: string;
    image?: Array<{ '#text': string; size: string }>;
  };
  '@attr'?: {
    rank: string;
  };
}

export interface AlbumDetail {
  name: string;
  artist: string | { name: string; mbid?: string; url?: string };
  image: Array<{ '#text': string; size: string }>;
  tracks: {
    track: Track[];
  };
  playcount?: string;
  listeners?: string;
  wiki?: {
    published?: string;
    summary?: string;
    content?: string;
  };
}

export interface Favourite {
  trackName: string;
  artistName: string;
  albumName: string;
  duration: string;
  addedAt: number;
}

export type SortOption = 'name-asc' | 'name-desc' | 'year-asc' | 'year-desc';

// App Types
export type View = 'overview' | 'detail' | 'search' | 'favourites';

export interface AlbumView {
  artist: string;
  album: string;
}

// Store Types
export interface StoreState {
  favourites: Favourite[];
  addFavourite: (favourite: Favourite) => void;
  removeFavourite: (trackName: string, artistName: string) => void;
  isFavourite: (trackName: string, artistName: string) => boolean;
}

// Component Props
export interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

export interface TrackListProps {
  tracks: Track[];
  albumName: string;
  artistName: string;
}

export interface TrackRowProps {
  track: Track;
  index: number;
  albumName: string;
  artistName: string;
}

// Page Props
export interface AlbumDetailProps {
  artistName: string;
  albumName: string;
  onBack: () => void;
}

export interface AlbumOverviewProps {
  onAlbumClick: (artist: string, album: string) => void;
}

export interface SearchProps {
  onAlbumClick: (artist: string, album: string) => void;
}
