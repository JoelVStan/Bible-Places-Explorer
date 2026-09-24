import React, { useState, useMemo } from 'react';
import { Place, Testament } from '../types';
import {
  Search,
  MapPin,
  Bookmark,
  ArrowRight,
} from 'lucide-react';

interface PlacesListViewProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  onLocateOnMap: (place: Place) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (placeId: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const PlacesListView: React.FC<PlacesListViewProps> = ({
  places,
  onSelectPlace,
  onLocateOnMap,
  bookmarkedIds,
  onToggleBookmark,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedTestament, setSelectedTestament] = useState<Testament | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Quick English alphabetical character chips for easy filtering
  const ENGLISH_ALPHABET_CHIPS = ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'R', 'S', 'T', 'Z'];

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      // Search match
      const q = searchQuery.trim().toLowerCase();
      let matchSearch = true;
      if (q) {
        const isSingleLetter = q.length === 1 && /^[a-z]$/i.test(q);
        if (isSingleLetter) {
          matchSearch =
            p.nameEn.toLowerCase().startsWith(q) ||
            p.nameEn.toLowerCase().includes(q) ||
            p.nameMl.toLowerCase().includes(q);
        } else {
          matchSearch =
            p.nameMl.toLowerCase().includes(q) ||
            p.nameEn.toLowerCase().includes(q) ||
            p.regionMl.toLowerCase().includes(q) ||
            p.modernCountryMl.toLowerCase().includes(q) ||
            p.briefDescriptionMl.toLowerCase().includes(q) ||
            Boolean(p.alternateNamesMl && p.alternateNamesMl.some((a) => a.toLowerCase().includes(q)));
        }
      }

      // Testament match
      const matchTestament =
        selectedTestament === 'ALL' ||
        p.testament === selectedTestament ||
        p.testament === 'BOTH';

      // Category match
      const matchCategory =
        selectedCategory === 'ALL' || p.category === selectedCategory;

      return matchSearch && matchTestament && matchCategory;
    });
  }, [places, searchQuery, selectedTestament, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 text-stone-900 dark:text-stone-100">
      {/* Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Biblical Places Directory
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              {filteredPlaces.length} sacred biblical places • Explore history, scriptures & maps
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search in English or Malayalam..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
            />
          </div>
        </div>

        {/* Quick English Alphabet Chips Assist */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 whitespace-nowrap">
            Quick A-Z filter:
          </span>
          {ENGLISH_ALPHABET_CHIPS.map((char) => {
            const isSelected = searchQuery.toUpperCase() === char;
            return (
              <button
                key={char}
                onClick={() => onSearchChange(isSelected ? '' : char)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs scale-105'
                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-stone-700 dark:text-stone-300'
                }`}
              >
                {char}
              </button>
            );
          })}
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="px-2.5 py-0.5 rounded-lg bg-red-100 dark:bg-red-950/60 hover:bg-red-200 dark:hover:bg-red-900 text-red-700 dark:text-red-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-200/60 dark:border-stone-800">
          {/* Testament Filters */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800/80 p-0.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setSelectedTestament('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedTestament === 'ALL'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedTestament('OT')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedTestament === 'OT'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Old Testament
            </button>
            <button
              onClick={() => setSelectedTestament('NT')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedTestament === 'NT'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              New Testament
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'ALL', label: 'All Categories' },
              { id: 'holy_city', label: '👑 Holy Cities' },
              { id: 'city', label: '🏛️ Towns' },
              { id: 'mountain', label: '⛰️ Mountains' },
              { id: 'water', label: '🌊 Seas & Waters' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Places Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlaces.map((place) => {
          const isSaved = bookmarkedIds.includes(place.id);

          return (
            <div
              key={place.id}
              className="p-5 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700/80 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top Badges & Bookmark */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                      {place.testament === 'BOTH'
                        ? 'Old & New'
                        : place.testament === 'OT'
                        ? 'Old Testament'
                        : 'New Testament'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                      {place.regionMl}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(place.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-stone-50 dark:bg-stone-700/60 text-stone-400 border-stone-200 dark:border-stone-600 hover:text-stone-700'
                    }`}
                    title={isSaved ? 'Remove from Saved' : 'Save place'}
                  >
                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-stone-900 dark:text-stone-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors flex items-baseline gap-1.5">
                  <span>{place.nameMl}</span>
                  <span className="text-xs font-normal text-stone-400">({place.nameEn})</span>
                </h3>

                <p className="text-xs text-amber-800 dark:text-amber-400 font-medium mt-0.5">
                  {place.modernCountryMl} • {place.modernNameMl}
                </p>

                {/* Brief */}
                <p className="text-xs font-scripture text-stone-600 dark:text-stone-300 mt-2.5 line-clamp-3 leading-relaxed">
                  {place.briefDescriptionMl}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 mt-4 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => onLocateOnMap(place)}
                  className="font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>View on Map</span>
                </button>

                <button
                  onClick={() => onSelectPlace(place)}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1 shadow-xs transition-all hover:scale-102"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-3">
          <p className="text-base font-bold text-stone-700 dark:text-stone-300">
            No matching places found for: "{searchQuery}"
          </p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            Try searching with another name in English or Malayalam (e.g. Jerusalem, യെരൂശലേം, Bethlehem, ബെത്ലഹേം).
          </p>
          <button
            onClick={() => {
              onSearchChange('');
              setSelectedTestament('ALL');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
