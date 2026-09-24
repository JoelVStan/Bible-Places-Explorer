import React, { useState, useEffect, useMemo } from 'react';
import { PLACES_DATA } from './data/placesData';
import { JOURNEYS_DATA } from './data/journeysData';
import { Place, Journey, Testament, JourneyStop } from './types';
import { Navbar, NavTab } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MapView } from './components/MapView';
import { PlacesListView } from './components/PlacesListView';
import { PaulJourneysView } from './components/PaulJourneysView';
import { JesusMinistryView } from './components/JesusMinistryView';
import { TimelineView } from './components/TimelineView';
import { AboutView } from './components/AboutView';
import { PlaceDetailModal } from './components/PlaceDetailModal';
import { FullChapterReader } from './components/FullChapterReader';
import { DailyFeaturedModal } from './components/DailyFeaturedModal';
import { BookmarksDrawer } from './components/BookmarksDrawer';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('map');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestament, setSelectedTestament] = useState<Testament | 'ALL'>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Selected Place & Modal
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Active Journey for Map
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);

  // Daily Featured Modal
  const [isDailyOpen, setIsDailyOpen] = useState(false);

  // Bookmarks State (LocalStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bible_places_bookmarks');
      if (saved !== null) {
        return JSON.parse(saved);
      }
      return ['jerusalem', 'bethlehem', 'nazareth'];
    } catch {
      return ['jerusalem', 'bethlehem', 'nazareth'];
    }
  });
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

  // Full Chapter Reader Modal State
  const [readerState, setReaderState] = useState<{
    isOpen: boolean;
    bookId: string;
    chapter: number;
    highlightVerse?: number;
  }>({
    isOpen: false,
    bookId: '49', // Luke
    chapter: 2,
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('bible_places_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark mode class and attribute to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('bible_places_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('bible_places_theme', 'light');
    }
  }, [darkMode]);

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('bible_places_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // storage error fallback
    }
  }, [bookmarkedIds]);

  // Determine today's featured place deterministically
  const dailyFeaturedPlace = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return PLACES_DATA[dayOfYear % PLACES_DATA.length] || PLACES_DATA[0];
  }, []);

  // Bookmarked Place Objects
  const bookmarkedPlaces = useMemo(() => {
    return PLACES_DATA.filter((p) => bookmarkedIds.includes(p.id));
  }, [bookmarkedIds]);

  // Handle bookmark toggle
  const handleToggleBookmark = (placeId: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]
    );
  };

  const handleClearBookmarks = () => {
    setBookmarkedIds([]);
  };

  // Open place details
  const handleSelectPlace = (place: Place) => {
    setSelectedPlace(place);
    setIsDetailModalOpen(true);
  };

  // Fly to place on map
  const handleLocateOnMap = (place: Place) => {
    setSelectedPlace(place);
    setActiveJourney(null);
    setCurrentTab('map');
  };

  // Select a place ID (e.g. from timeline or stop)
  const handleSelectPlaceById = (placeId: string) => {
    const found = PLACES_DATA.find((p) => p.id === placeId);
    if (found) {
      handleLocateOnMap(found);
    } else {
      setCurrentTab('map');
    }
  };

  // Show a journey on map
  const handleSelectJourneyForMap = (journey: Journey) => {
    setActiveJourney(journey);
    setSelectedPlace(null);
    setCurrentTab('map');
  };

  // Show a specific stop on map
  const handleSelectStopOnMap = (stop: JourneyStop) => {
    const matchingPlace = PLACES_DATA.find((p) => p.id === stop.placeId);
    if (matchingPlace) {
      handleLocateOnMap(matchingPlace);
    } else {
      setCurrentTab('map');
    }
  };

  // Read full chapter
  const handleReadChapter = (bookId: string, chapter: number, highlightVerse?: number) => {
    setReaderState({
      isOpen: true,
      bookId,
      chapter,
      highlightVerse,
    });
  };

  return (
    <div className={`min-h-[100dvh] ${currentTab === 'map' ? 'h-[100dvh] overflow-hidden' : ''} flex flex-col bg-stone-100 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors duration-150 relative`}>
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'map') {
            setActiveJourney(null);
          }
        }}
        onOpenDaily={() => setIsDailyOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        bookmarksCount={bookmarkedIds.length}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && currentTab !== 'places' && currentTab !== 'map') {
            setCurrentTab('places');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col min-h-0 relative">
        {/* TAB 1: INTERACTIVE MAP */}
        {currentTab === 'map' && (
          <div className="w-full h-full flex-1 min-h-0 relative overflow-hidden pb-16 md:pb-0">
            <MapView
              places={PLACES_DATA}
              selectedPlace={selectedPlace}
              onSelectPlace={handleSelectPlace}
              activeJourney={activeJourney}
              selectedTestament={selectedTestament}
              onChangeTestament={setSelectedTestament}
              activeCategory={activeCategory}
              onChangeCategory={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        )}

        {/* TAB 2: PLACES DIRECTORY LIST */}
        {currentTab === 'places' && (
          <div className="pb-28 md:pb-8 flex-1">
            <PlacesListView
              places={PLACES_DATA}
              onSelectPlace={handleSelectPlace}
              onLocateOnMap={handleLocateOnMap}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}

        {/* TAB 3: PAUL'S MISSIONARY JOURNEYS */}
        {currentTab === 'paul' && (
          <div className="pb-28 md:pb-8 flex-1">
            <PaulJourneysView
              onSelectJourneyForMap={handleSelectJourneyForMap}
              onSelectStopOnMap={handleSelectStopOnMap}
              onReadVerse={handleReadChapter}
            />
          </div>
        )}

        {/* TAB 4: JESUS' MINISTRY ROUTE */}
        {currentTab === 'jesus' && (
          <div className="pb-28 md:pb-8 flex-1">
            <JesusMinistryView
              onSelectJourneyForMap={handleSelectJourneyForMap}
              onSelectStopOnMap={handleSelectStopOnMap}
              onReadVerse={handleReadChapter}
            />
          </div>
        )}

        {/* TAB 5: TIMELINE OF BIBLICAL EVENTS */}
        {currentTab === 'timeline' && (
          <div className="pb-28 md:pb-8 flex-1">
            <TimelineView
              onSelectPlaceId={handleSelectPlaceById}
              onReadVerse={handleReadChapter}
            />
          </div>
        )}

        {/* TAB 6: ABOUT PAGE */}
        {currentTab === 'about' && (
          <div className="flex-1">
            <AboutView
              onNavigateTab={(tab) => {
                setCurrentTab(tab);
                if (tab !== 'map') {
                  setActiveJourney(null);
                }
              }}
              onOpenDaily={() => setIsDailyOpen(true)}
              onLocatePlaceById={handleSelectPlaceById}
            />
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'map') {
            setActiveJourney(null);
          }
        }}
      />

      {/* Place Detail Modal */}
      {isDetailModalOpen && selectedPlace && (
        <PlaceDetailModal
          place={selectedPlace}
          onClose={() => setIsDetailModalOpen(false)}
          isBookmarked={bookmarkedIds.includes(selectedPlace.id)}
          onToggleBookmark={handleToggleBookmark}
          onReadChapter={handleReadChapter}
          onLocateOnMap={handleLocateOnMap}
        />
      )}

      {/* Daily Featured Location Modal ("ഇന്ന് ഈ സ്ഥലത്ത്") */}
      {isDailyOpen && dailyFeaturedPlace && (
        <DailyFeaturedModal
          place={dailyFeaturedPlace}
          onClose={() => setIsDailyOpen(false)}
          onExplorePlace={handleLocateOnMap}
          onReadVerseChapter={handleReadChapter}
        />
      )}

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedPlaces={bookmarkedPlaces}
        onSelectPlace={handleSelectPlace}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={handleClearBookmarks}
      />

      {/* Full Malayalam Chapter Reader Modal */}
      {readerState.isOpen && (
        <FullChapterReader
          bookId={readerState.bookId}
          chapterNumber={readerState.chapter}
          highlightVerse={readerState.highlightVerse}
          onClose={() => setReaderState((prev) => ({ ...prev, isOpen: false }))}
          onNavigateChapter={(bId, ch) =>
            setReaderState((prev) => ({ ...prev, bookId: bId, chapter: ch, highlightVerse: undefined }))
          }
        />
      )}
    </div>
  );
}
