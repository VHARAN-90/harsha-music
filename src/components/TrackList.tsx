import React from 'react';
import { YouTubeVideo } from '../types/youtube';
import { youtubeApi } from '../services/youtubeApi';
import { Play, Pause } from 'lucide-react';

interface TrackListProps {
  tracks: YouTubeVideo[];
  currentTrack: YouTubeVideo | null;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
  onPlay: () => void;
  onPause: () => void;
}

export const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrack,
  isPlaying,
  onTrackSelect,
  onPlay,
  onPause,
}) => {
  const handleTrackClick = (track: YouTubeVideo, index: number) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        onPause();
      } else {
        onPlay();
      }
    } else {
      onTrackSelect(index);
    }
  };

  return (
    <div className="space-y-2">
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        const isCurrentlyPlaying = isCurrentTrack && isPlaying;

        return (
          <div
            key={track.id}
            onClick={() => handleTrackClick(track, index)}
            className={`group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
              isCurrentTrack
                ? 'bg-gradient-to-r from-[#FF3CAC]/20 to-[#784BA0]/20 border border-[#FF3CAC]/30'
                : 'bg-white/5 hover:bg-white/10 border border-transparent'
            }`}
          >
            <div className="relative flex-shrink-0 mr-4">
              <img
                src={track.thumbnails.medium.url}
                alt={track.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {isCurrentlyPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white" />
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${
                isCurrentTrack ? 'text-white' : 'text-gray-200'
              }`}>
                {track.title}
              </h3>
              <p className="text-sm text-gray-300 truncate">
                {track.channelTitle}
              </p>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-300">
              <span>{youtubeApi.formatDuration(track.duration)}</span>
              {isCurrentlyPlaying && (
                <div className="flex space-x-1">
                  <div className="w-1 h-4 bg-[#FF3CAC] rounded-full animate-pulse"></div>
                  <div className="w-1 h-4 bg-[#784BA0] rounded-full animate-pulse animation-delay-75"></div>
                  <div className="w-1 h-4 bg-[#FF3CAC] rounded-full animate-pulse animation-delay-150"></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};