import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for songs, artists, or playlists"
          className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF3CAC]/50 focus:border-transparent transition-all duration-200"
          disabled={isLoading}
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-300 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-300" />
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={!query.trim() || isLoading}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#FF3CAC]/80 hover:to-[#784BA0]/80 transition-all duration-200 text-sm font-medium"
      >
        Search
      </button>
    </form>
  );
};