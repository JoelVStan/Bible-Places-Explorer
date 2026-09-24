import React from 'react';
import { Place } from '../types';
import {
  Sparkles,
  Calendar,
  X,
  Compass,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface DailyFeaturedModalProps {
  place: Place;
  onClose: () => void;
  onExplorePlace: (place: Place) => void;
  onReadVerseChapter: (bookId: string, chapter: number, verseStart: number) => void;
}

export const DailyFeaturedModal: React.FC<DailyFeaturedModalProps> = ({
  place,
  onClose,
  onExplorePlace,
  onReadVerseChapter,
}) => {
  // Format today's date
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const primaryVerse = place.verses[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-amber-50 via-white to-amber-50/70 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 rounded-3xl shadow-2xl border-2 border-amber-300 dark:border-amber-700/60 overflow-hidden flex flex-col text-stone-900 dark:text-stone-100">
        {/* Decorative Top Accent */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-bold mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>ഇന്ന് ഈ സ്ഥലത്ത് • Today at this Place</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateFormatted}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Place Card */}
        <div className="px-6 py-2 overflow-y-auto space-y-4 max-h-[70vh]">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-100/50 to-orange-100/30 dark:from-stone-800/80 dark:to-stone-800/40 border border-amber-300/60 dark:border-stone-700">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50">
                {place.nameMl}
              </h2>
              <span className="text-base font-semibold text-stone-500">({place.nameEn})</span>
            </div>
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-400 mt-1">
              {place.regionMl} • {place.modernCountryMl}
            </p>

            <p className="text-xs sm:text-sm font-scripture text-stone-700 dark:text-stone-300 mt-3 leading-relaxed">
              {place.briefDescriptionMl}
            </p>
          </div>

          {/* Daily Scripture Quote */}
          {primaryVerse && (
            <div className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-300 mb-2">
                <span>📖 Scripture of the Day: {primaryVerse.bookName} {primaryVerse.chapter}:{primaryVerse.verseStart}</span>
                <button
                  onClick={() => onReadVerseChapter(primaryVerse.bookId, primaryVerse.chapter, primaryVerse.verseStart)}
                  className="text-stone-500 hover:text-amber-600 flex items-center gap-1 text-[11px] font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Read Chapter
                </button>
              </div>

              <blockquote className="font-scripture text-base sm:text-lg text-stone-900 dark:text-stone-100 italic border-l-4 border-amber-500 pl-3.5 leading-relaxed my-2">
                "{primaryVerse.textMalayalam}"
              </blockquote>

              {primaryVerse.explanation && (
                <p className="text-xs font-scripture text-stone-500 dark:text-stone-400 mt-2">
                  {primaryVerse.explanation}
                </p>
              )}
            </div>
          )}

          {/* Daily Spiritual Thought */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-scripture">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">
              ആത്മീയ ചിന്ത (Spiritual Reflection):
            </h4>
            <p>
              വിശുദ്ധ ചരിത്രത്തിൽ ദൈവം പ്രവർത്തിച്ച പുണ്യസ്ഥലങ്ങൾ വെറും ചരിത്ര സ്മാരകങ്ങളല്ല; നമ്മുടെ ജീവിതത്തിലും അവിടുത്തെ വിശ്വസ്തതയും വാഗ്ദാനങ്ങളും സജീവമായി നിലനിൽക്കുന്നു എന്നതിന്റെ സാക്ഷ്യങ്ങളാണ്.
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 pt-4 border-t border-amber-200/60 dark:border-stone-800 bg-amber-50/50 dark:bg-stone-900/50 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-stone-500">
            Explore sacred biblical heritage daily
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onExplorePlace(place);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-900/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
            >
              <Compass className="w-4 h-4" />
              <span>Explore on Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
