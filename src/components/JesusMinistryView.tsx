import React from 'react';
import { JOURNEYS_DATA } from '../data/journeysData';
import { Journey, JourneyStop } from '../types';
import {
  BookOpen,
  MapPin,
  Compass,
  ArrowRight,
  Heart,
} from 'lucide-react';

interface JesusMinistryViewProps {
  onSelectJourneyForMap: (journey: Journey) => void;
  onSelectStopOnMap: (stop: JourneyStop) => void;
  onReadVerse: (bookId: string, chapter: number, verseStart: number) => void;
}

export const JesusMinistryView: React.FC<JesusMinistryViewProps> = ({
  onSelectJourneyForMap,
  onSelectStopOnMap,
  onReadVerse,
}) => {
  const jesusJourney = JOURNEYS_DATA.find((j) => j.type === 'jesus') || JOURNEYS_DATA[4];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 text-stone-900 dark:text-stone-100">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold">
          <Heart className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
          <span>Gospel Routes • യേശുവിന്റെ ശുശ്രൂഷാ പാത</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Jesus' Earthly Ministry & Passion Route
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          Trace Christ's footsteps from His birth in Bethlehem, through the hills of Galilee, across Samaria and Jericho, culminating in Jerusalem at Calvary.
        </p>
      </div>

      {/* Hero Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-100/60 via-amber-50 to-orange-50/50 dark:from-stone-800/90 dark:via-stone-900 dark:to-stone-900 border border-amber-300/80 dark:border-stone-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border border-amber-400/40">
              {jesusJourney.subtitleMl}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              13 Ministry Stages
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 flex items-baseline gap-2 flex-wrap">
            <span>{jesusJourney.titleMl}</span>
            <span className="text-sm font-normal text-stone-500">({jesusJourney.titleEn})</span>
          </h2>
          <p className="text-xs sm:text-sm font-scripture text-stone-700 dark:text-stone-300 leading-relaxed">
            {jesusJourney.descriptionMl}
          </p>
        </div>

        {/* Action Button: Show on Map */}
        <button
          onClick={() => onSelectJourneyForMap(jesusJourney)}
          className="w-full md:w-auto justify-center shrink-0 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-900/20 active:scale-95 transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>View Route on Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Sequential Route Stepper Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 px-1">
          Chronological Stages (ശുശ്രൂഷാ ഘട്ടങ്ങൾ)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {jesusJourney.stops.map((stop) => (
            <div
              key={stop.stopNumber}
              className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0 bg-amber-600"
                    >
                      {stop.stopNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        {stop.placeNameMl}
                      </h4>
                      <span className="text-[11px] text-stone-400">({stop.placeNameEn})</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/60 dark:bg-stone-700 text-amber-800 dark:text-amber-300">
                    Step {stop.stopNumber}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-scripture text-stone-600 dark:text-stone-300 leading-relaxed mb-3">
                  {stop.descriptionMl}
                </p>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between text-xs">
                <button
                  onClick={() => onReadVerse(stop.bookId, stop.chapter, stop.verseStart)}
                  className="font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{stop.bibleReferenceMl}</span>
                </button>

                <button
                  onClick={() => onSelectStopOnMap(stop)}
                  className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 font-medium flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>View on Map</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
