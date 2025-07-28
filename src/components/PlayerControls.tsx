import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { PlayerState } from '../types/youtube';

interface PlayerControlsProps {
  playerState: PlayerState;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  playerState,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
}) => {
  const { isPlaying, currentTime, duration, volume, currentTrack, currentIndex, queue } = playerState;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;
    onSeek(seekTime);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newVolume = Math.max(0, Math.min(100, percentage * 100));
    onVolumeChange(newVolume);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#2B2D42]/90 backdrop-blur-xl border-t border-white/10 p-4">
      <div className="max-w-4xl mx-auto">
        {currentTrack && (
          <div className="flex items-center mb-4">
            <img
              src={currentTrack.thumbnails.medium.url}
              alt={currentTrack.title}
              className="w-16 h-16 rounded-lg object-cover mr-4"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate text-lg">
                {currentTrack.title}
              </h3>
              <p className="text-gray-400 truncate">
                {currentTrack.channelTitle}
              </p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <div
            className="w-full h-2 bg-white/20 rounded-full cursor-pointer group"
            onClick={handleSeekClick}
          >
            <div
              className="h-full bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] rounded-full relative transition-all duration-100 ease-out group-hover:from-[#FF3CAC]/80 group-hover:to-[#784BA0]/80"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-6 mb-4">
          <button
            onClick={onPrevious}
            disabled={currentIndex <= 0}
            className="p-2 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <SkipBack className="h-6 w-6" />
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={!currentTrack}
            className="p-4 bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] hover:from-[#FF3CAC]/80 hover:to-[#784BA0]/80 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8" />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={currentIndex >= queue.length - 1}
            className="p-2 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <SkipForward className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center justify-center space-x-3">
          {volume === 0 ? (
            <VolumeX className="h-5 w-5 text-gray-300" />
          ) : (
            <Volume2 className="h-5 w-5 text-gray-300" />
          )}
          <div
            className="w-24 h-2 bg-white/20 rounded-full cursor-pointer group"
            onClick={handleVolumeClick}
          >
            <div
              className="h-full bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] rounded-full relative group-hover:from-[#FF3CAC]/80 group-hover:to-[#784BA0]/80 transition-colors duration-200"
              style={{ width: `${volume}%` }}
            >
              <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
          </div>
          <span className="text-sm text-gray-300 w-8">{Math.round(volume)}%</span>
        </div>
      </div>
    </div>
  );
};