import React, { useState, useEffect } from 'react';
import { Music, Headphones, Heart } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { TrackList } from './components/TrackList';
import { PlayerControls } from './components/PlayerControls';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { youtubeApi, YouTubeApiService } from './services/youtubeApi';
import { YouTubeVideo } from './types/youtube';

function App() {
  const [apiService] = useState<YouTubeApiService>(youtubeApi);
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    playerState,
    isPlayerReady,
    play,
    pause,
    setVolume,
    seekTo,
    setQueue,
    playNext,
    playPrevious,
    playTrack,
  } = useYouTubePlayer();

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await apiService.searchVideos(query, 20);
      setSearchResults(results);
      if (results.length > 0) {
        setQueue(results, 0);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTrackSelect = (index: number) => {
    playTrack(index);
  };

  return (
    <div className="min-h-screen bg-[#2B2D42]">
      <div 
        id="youtube-player" 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '-9999px',
          width: '0px',
          height: '0px',
          opacity: 0,
          pointerEvents: 'none'
        }}
      ></div>

      <div className="container mx-auto px-4 py-8 pb-32">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] rounded-full flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] bg-clip-text text-transparent">
              Harsha Music Player
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Search and play your favorite songs with continuous auto-play. Songs will automatically play one after another.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar onSearch={handleSearch} isLoading={isSearching} />
        </div>

        <div className="max-w-4xl mx-auto">
          {(hasSearched && (searchResults.length > 0 || isSearching)) && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {isSearching ? 'Searching...' : `Found ${searchResults.length} tracks`}
                </h2>
                {searchResults.length > 0 && (
                  <div className="text-sm text-gray-300">
                    {playerState.currentIndex + 1} of {playerState.queue.length}
                  </div>
                )}
              </div>

              {isSearching ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center p-3">
                        <div className="w-12 h-12 bg-white/10 rounded-lg mr-4"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-white/10 rounded mb-2 w-3/4"></div>
                          <div className="h-3 bg-white/10 rounded w-1/2"></div>
                        </div>
                        <div className="w-12 h-4 bg-white/10 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <TrackList
                  tracks={searchResults}
                  currentTrack={playerState.currentTrack}
                  isPlaying={playerState.isPlaying}
                  onTrackSelect={handleTrackSelect}
                  onPlay={play}
                  onPause={pause}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {isPlayerReady && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <PlayerControls
            playerState={playerState}
            onPlay={play}
            onPause={pause}
            onNext={playNext}
            onPrevious={playPrevious}
            onSeek={seekTo}
            onVolumeChange={setVolume}
          />
        </div>
      )}
    </div>
  );
}

export default App;