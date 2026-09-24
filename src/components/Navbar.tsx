import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Route,
  Clock,
  Sparkles,
  Bookmark,
  Sun,
  Moon,
  Search,
  BookOpen,
  List,
  X,
} from 'lucide-react';

export type NavTab = 'map' | 'places' | 'paul' | 'jesus' | 'timeline';

interface NavbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenDaily: () => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenDaily,
  onOpenBookmarks,
  bookmarksCount,
  darkMode,
  onToggleDarkMode,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-amber-50/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-amber-200/60 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            {/* Logo & Brand */}
            <div
              onClick={() => onTabChange('map')}
              className="flex items-center gap-2 cursor-pointer shrink-0 group select-none"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50 flex items-center justify-center shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-tight text-stone-900 dark:text-stone-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    Bible Places Explorer
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-bold bg-amber-200/70 text-amber-900 dark:bg-amber-950 dark:text-amber-300 hidden md:inline-block">
                    Atlas
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-800 dark:text-amber-400 font-medium -mt-0.5 font-scripture">
                  ബൈബിൾ സ്ഥലങ്ങൾ • മലയാളം അറ്റ്ലസ്
                </p>
              </div>
            </div>

            {/* Desktop / Tablet Search Input */}
            <div className="relative flex-1 max-w-xs md:max-w-sm hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search places (e.g. Jerusalem, Bethlehem)..."
                className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm rounded-full bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="sm:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
                title="Search"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Today's Place Button */}
              <button
                onClick={onOpenDaily}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-200 transition-all shadow-xs shrink-0"
                title="Today's Biblical Place"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden md:inline">Today's Place</span>
                <span className="md:hidden text-[11px] font-bold">Today</span>
              </button>

              {/* Bookmarks Button */}
              <button
                onClick={onOpenBookmarks}
                className="relative p-2 rounded-xl hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors shrink-0"
                title="Saved Places"
                aria-label="Bookmarks"
              >
                <Bookmark className="w-4 h-4" />
                {bookmarksCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {bookmarksCount}
                  </span>
                )}
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="relative p-2 rounded-xl bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700/80 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-amber-300 transition-all shadow-xs active:scale-90 cursor-pointer shrink-0"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-200" />
                ) : (
                  <Moon className="w-4 h-4 text-stone-600 dark:text-stone-300 -rotate-12 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Search Input */}
          {mobileSearchOpen && (
            <div className="pb-2.5 sm:hidden animate-in fade-in slide-in-from-top-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search places (e.g. Jerusalem, Bethlehem)..."
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Desktop & Tablet Navigation Tabs Bar */}
          <nav className="hidden sm:flex items-center justify-center gap-1.5 py-1.5 border-t border-amber-200/40 dark:border-stone-800/80 overflow-x-auto no-scrollbar">
            <button
              onClick={() => onTabChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                currentTab === 'map'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Interactive Map</span>
            </button>

            <button
              onClick={() => onTabChange('places')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                currentTab === 'places'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Places Directory</span>
            </button>

            <button
              onClick={() => onTabChange('paul')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                currentTab === 'paul'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
              }`}
            >
              <Route className="w-3.5 h-3.5 text-blue-500" />
              <span>Paul's Journeys</span>
            </button>

            <button
              onClick={() => onTabChange('jesus')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                currentTab === 'jesus'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Jesus' Ministry Route</span>
            </button>

            <button
              onClick={() => onTabChange('timeline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                currentTab === 'timeline'
                  ? 'bg-amber-600 text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-amber-100/60 dark:hover:bg-stone-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (Thumb-Friendly on Phones & Compact Tablets) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 dark:bg-stone-900/98 backdrop-blur-lg border-t border-amber-200/70 dark:border-stone-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-1 py-1 flex items-center justify-around">
        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'map'
              ? 'text-amber-700 dark:text-amber-400 font-bold scale-105'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Compass className={`w-4 h-4 ${currentTab === 'map' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Map</span>
        </button>

        <button
          onClick={() => onTabChange('places')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'places'
              ? 'text-amber-700 dark:text-amber-400 font-bold scale-105'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <List className={`w-4 h-4 ${currentTab === 'places' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Places</span>
        </button>

        <button
          onClick={() => onTabChange('paul')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'paul'
              ? 'text-blue-600 dark:text-blue-400 font-bold scale-105'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Route className={`w-4 h-4 ${currentTab === 'paul' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Paul</span>
        </button>

        <button
          onClick={() => onTabChange('jesus')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'jesus'
              ? 'text-amber-700 dark:text-amber-400 font-bold scale-105'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${currentTab === 'jesus' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Jesus</span>
        </button>

        <button
          onClick={() => onTabChange('timeline')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            currentTab === 'timeline'
              ? 'text-amber-700 dark:text-amber-400 font-bold scale-105'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Clock className={`w-4 h-4 ${currentTab === 'timeline' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Timeline</span>
        </button>
      </div>
    </>
  );
};
