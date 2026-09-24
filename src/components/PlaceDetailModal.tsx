import React, { useState } from 'react';
import { Place, VerseReference, BiblicalEvent } from '../types';
import {
  X,
  Bookmark,
  Share2,
  Copy,
  BookOpen,
  MapPin,
  Calendar,
  Compass,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

interface PlaceDetailModalProps {
  place: Place | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (placeId: string) => void;
  onReadChapter: (bookId: string, chapter: number, initialVerse?: number) => void;
  onLocateOnMap?: (place: Place) => void;
}

type TabType = 'history' | 'verses' | 'events' | 'modern';

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
  place,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onReadChapter,
  onLocateOnMap,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('history');
  const [copiedVerseIndex, setCopiedVerseIndex] = useState<number | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!place) return null;

  const handleCopyVerse = (verse: VerseReference, index: number) => {
    const textToCopy = `"${verse.textMalayalam}" (${verse.bookName} ${verse.chapter}:${verse.verseStart}${
      verse.verseEnd ? '-' + verse.verseEnd : ''
    }) - Bible Places Explorer (മലയാളം ബൈബിൾ അറ്റ്ലസ്)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerseIndex(index);
    setTimeout(() => setCopiedVerseIndex(null), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${place.nameMl} (${place.nameEn}) - Bible Places Explorer`,
          text: `${place.nameMl} (${place.nameEn}): ${place.briefDescriptionMl}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `${place.nameMl} (${place.nameEn}) - ${place.briefDescriptionMl}`
      );
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92dvh] sm:max-h-[90vh] bg-amber-50/98 dark:bg-stone-900/98 rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-amber-200 dark:border-stone-800 flex flex-col overflow-hidden text-stone-900 dark:text-stone-100">
        {/* Subtle mobile sheet drag indicator */}
        <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Modal Header */}
        <div className="px-4 sm:px-6 pt-3 sm:pt-6 pb-3 sm:pb-4 border-b border-amber-200/50 dark:border-stone-800/80 bg-gradient-to-r from-amber-100/50 via-transparent to-amber-100/30 dark:from-stone-800/50 dark:to-stone-900/30">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30">
                  {place.testament === 'BOTH'
                    ? 'Old & New Testament'
                    : place.testament === 'OT'
                    ? 'Old Testament'
                    : 'New Testament'}
                </span>
                <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  {place.regionMl}
                </span>
                {place.elevation && (
                  <span className="text-[10px] sm:text-xs text-stone-500 flex items-center gap-1">
                    <Compass className="w-3 h-3" /> {place.elevation}
                  </span>
                )}
              </div>

              {/* Title with Malayalam primary and English */}
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 flex items-baseline gap-2 flex-wrap">
                <span>{place.nameMl}</span>
                <span className="text-sm sm:text-lg font-medium text-stone-500 dark:text-stone-400">
                  ({place.nameEn})
                </span>
              </h2>

              {place.alternateNamesMl && place.alternateNamesMl.length > 0 && (
                <p className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-scripture truncate">
                  Also known as: {place.alternateNamesMl.join(', ')}
                </p>
              )}
            </div>

            {/* Quick Actions (Bookmark, Share, Close) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <button
                onClick={() => onToggleBookmark(place.id)}
                className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                  isBookmarked
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
                }`}
                title={isBookmarked ? 'Remove from Saved' : 'Save this place'}
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 transition-colors cursor-pointer active:scale-95"
                title="Share place details"
              >
                {shareSuccess ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 border border-stone-200 dark:border-stone-700 hover:bg-stone-100 transition-colors cursor-pointer active:scale-95"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-3 sm:mt-4 overflow-x-auto no-scrollbar pb-0.5">
            {[
              { id: 'history', label: 'History & Meaning' },
              { id: 'verses', label: `Verses (${place.verses.length})` },
              { id: 'events', label: `Events (${place.keyEvents.length})` },
              { id: 'modern', label: 'Geography' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-amber-100/60 dark:hover:bg-stone-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {/* TAB 1: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-stone-800/60 border border-amber-200/80 dark:border-stone-700/60">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-1">
                  <Info className="w-4 h-4" />
                  <span>Spiritual & Biblical Significance</span>
                </div>
                <p className="text-sm font-scripture text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                  {place.significanceMl}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Detailed Biblical Narrative
                </h4>
                <p className="text-sm sm:text-base font-scripture text-stone-700 dark:text-stone-300 leading-relaxed text-justify">
                  {place.detailedHistoryMl}
                </p>
              </div>

              {/* Action: Locate on Map */}
              {onLocateOnMap && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      onLocateOnMap(place);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md shadow-amber-900/20 transition-all hover:scale-[1.02]"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Focus this place on Interactive Map</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VERSES (Malayalam Holy Bible from GitHub repository) */}
          {activeTab === 'verses' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs text-stone-500 border-b pb-2 border-stone-200 dark:border-stone-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Malayalam Bible Scriptures</span>
                </span>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                  Click to read full chapter
                </span>
              </div>

              {place.verses.map((v, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 shadow-xs hover:border-amber-400 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300/60 dark:border-amber-800/50">
                      📖 {v.bookName} {v.chapter}:{v.verseStart}
                      {v.verseEnd && v.verseEnd > v.verseStart ? `-${v.verseEnd}` : ''}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopyVerse(v, idx)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-xs flex items-center gap-1"
                        title="Copy Malayalam verse"
                      >
                        {copiedVerseIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-green-600 text-[11px] font-medium">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onReadChapter(v.bookId, v.chapter, v.verseStart)}
                        className="px-2.5 py-1 rounded-lg bg-amber-600/10 hover:bg-amber-600 text-amber-800 dark:text-amber-300 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                        title="Read full chapter"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read Chapter {v.chapter}</span>
                      </button>
                    </div>
                  </div>

                  {/* Malayalam Scripture Quote */}
                  <blockquote className="my-2.5 pl-3.5 border-l-3 border-amber-500 text-sm sm:text-base font-scripture text-stone-900 dark:text-stone-100 leading-relaxed italic">
                    "{v.textMalayalam}"
                  </blockquote>

                  {v.explanation && (
                    <p className="text-xs font-scripture text-stone-500 dark:text-stone-400 mt-2">
                      💡 {v.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: KEY EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-300 dark:before:bg-stone-700">
                {place.keyEvents.map((evt, idx) => (
                  <div key={idx} className="relative group">
                    {/* Timeline Node */}
                    <div className="absolute -left-[27px] top-1.5 w-4 h-4 rounded-full bg-amber-600 border-2 border-white dark:border-stone-900 shadow-md group-hover:scale-125 transition-transform" />

                    <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                          {evt.title}
                        </h4>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                          {evt.era}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-scripture text-stone-600 dark:text-stone-300 leading-relaxed">
                        {evt.description}
                      </p>
                      {evt.verseRef && (
                        <div className="mt-2 text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <span>Scripture Reference: {evt.verseRef}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MODERN GEOGRAPHY */}
          {activeTab === 'modern' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-xs text-stone-400 font-medium">Modern Country / Territory</span>
                  <p className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {place.modernCountryMl} ({place.regionMl})
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <span className="text-xs text-stone-400 font-medium">Modern Location Name</span>
                  <p className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                    {place.modernNameMl}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 sm:col-span-2">
                  <span className="text-xs text-stone-400 font-medium">Geographical Coordinates</span>
                  <p className="text-sm font-mono text-stone-800 dark:text-stone-200 mt-0.5">
                    Latitude: {place.lat}° N, Longitude: {place.lng}° E
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-scripture">
                <p>
                  പുരാതന കാലത്ത് ഈ പ്രദേശം <strong>{place.regionMl}</strong> എന്നറിയപ്പെട്ടിരുന്നു. ചരിത്രാവശിഷ്ടങ്ങളും ബൈബിൾ പുരാവസ്തു ഗവേഷണ കേന്ദ്രങ്ങളും ഇന്നും ഇവിടെ സംരക്ഷിക്കപ്പെട്ടിരിക്കുന്നു.
                </p>
              </div>

              {/* External Google Maps link */}
              <div className="pt-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
                >
                  <span>View modern satellite location on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-amber-200/50 dark:border-stone-800 bg-amber-50/70 dark:bg-stone-900/70 flex items-center justify-between text-xs text-stone-500 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <span className="hidden sm:inline">Bible Places Explorer • Malayalam Biblical Atlas</span>
          <span className="sm:hidden text-[11px] font-scripture text-amber-800 dark:text-amber-400">മലയാളം ബൈബിൾ അറ്റ്ലസ്</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
