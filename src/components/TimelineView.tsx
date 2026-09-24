import React, { useState } from 'react';
import { TIMELINE_DATA } from '../data/timelineData';
import { Testament } from '../types';
import {
  Clock,
  MapPin,
  BookOpen,
  Compass,
} from 'lucide-react';

interface TimelineViewProps {
  onSelectPlaceId: (placeId: string) => void;
  onReadVerse: (bookId: string, chapter: number, verseStart: number) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  onSelectPlaceId,
  onReadVerse,
}) => {
  const [filterTestament, setFilterTestament] = useState<Testament | 'ALL'>('ALL');

  const filteredEvents = TIMELINE_DATA.filter((item) => {
    if (filterTestament === 'ALL') return true;
    return item.testament === filterTestament;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 text-stone-900 dark:text-stone-100">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>Chronological Atlas • ചരിത്ര സമയരേഖ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Biblical Timeline of Events
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          Trace landmark events from the Call of Abraham (~2090 BC) through the Exodus, Davidic Kingdom, and Christ's earthly life to the Apostolic Revelation (~95 AD).
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
        <button
          onClick={() => setFilterTestament('ALL')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
            filterTestament === 'ALL'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
          }`}
        >
          All Eras ({TIMELINE_DATA.length})
        </button>
        <button
          onClick={() => setFilterTestament('OT')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
            filterTestament === 'OT'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
          }`}
        >
          Old Testament (BC)
        </button>
        <button
          onClick={() => setFilterTestament('NT')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
            filterTestament === 'NT'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
          }`}
        >
          New Testament (AD)
        </button>
      </div>

      {/* Vertical Timeline Tree */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-1 before:bg-gradient-to-b before:from-amber-400 before:via-amber-600 before:to-orange-500 rounded-full">
        {filteredEvents.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Node Ring */}
            <div className="absolute -left-[30px] sm:-left-[34px] top-4 w-5 h-5 rounded-full bg-amber-600 border-4 border-amber-50 dark:border-stone-900 shadow-md group-hover:scale-125 transition-transform" />

            {/* Event Card */}
            <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-800/90 border border-stone-200 dark:border-stone-700/80 shadow-md hover:shadow-xl hover:border-amber-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                    {item.year}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                    {item.testament === 'OT' ? 'Old Testament' : 'New Testament'}
                  </span>
                  <button
                    onClick={() => onSelectPlaceId(item.placeId)}
                    className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.placeNameMl}</span>
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors flex items-baseline gap-2 flex-wrap">
                  <span>{item.titleMl}</span>
                  <span className="text-xs font-normal text-stone-400">({item.titleEn})</span>
                </h3>

                <p className="text-xs sm:text-sm font-scripture text-stone-700 dark:text-stone-300 leading-relaxed">
                  {item.descriptionMl}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-stone-100 dark:border-stone-700">
                <button
                  onClick={() => onReadVerse(item.bookId, item.chapter, item.verseStart)}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-stone-700 hover:bg-amber-100 dark:hover:bg-stone-600 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{item.verseMl}</span>
                </button>

                <button
                  onClick={() => onSelectPlaceId(item.placeId)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
