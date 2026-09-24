import React, { useState } from 'react';
import { JOURNEYS_DATA } from '../data/journeysData';
import { Journey, JourneyStop } from '../types';
import {
  Compass,
  MapPin,
  BookOpen,
  ArrowRight,
  Navigation,
} from 'lucide-react';

interface PaulJourneysViewProps {
  onSelectJourneyForMap: (journey: Journey) => void;
  onSelectStopOnMap: (stop: JourneyStop) => void;
  onReadVerse: (bookId: string, chapter: number, verseStart: number) => void;
}

export const PaulJourneysView: React.FC<PaulJourneysViewProps> = ({
  onSelectJourneyForMap,
  onSelectStopOnMap,
  onReadVerse,
}) => {
  const paulJourneys = JOURNEYS_DATA.filter((j) => j.type === 'paul');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(paulJourneys[0].id);

  const currentJourney = paulJourneys.find((j) => j.id === selectedJourneyId) || paulJourneys[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 text-stone-900 dark:text-stone-100">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold">
          <Navigation className="w-3.5 h-3.5" />
          <span>Apostolic Missions • പൗലോസിന്റെ യാത്രകൾ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Apostle Paul's Missionary Journeys
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
          Explore the epic missionary journeys of Apostle Paul across the Mediterranean, Asia Minor, Greece, and Rome through interactive routes and Malayalam scripture texts.
        </p>
      </div>

      {/* Journey Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {paulJourneys.map((j) => (
          <button
            key={j.id}
            onClick={() => setSelectedJourneyId(j.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 whitespace-nowrap ${
              selectedJourneyId === j.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20 scale-102'
                : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:bg-stone-100'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: j.color }}
            />
            <span>{j.titleEn}</span>
          </button>
        ))}
      </div>

      {/* Selected Journey Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-amber-50/40 dark:from-stone-800/90 dark:via-stone-900 dark:to-stone-900 border border-blue-200/80 dark:border-stone-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300/50">
              {currentJourney.subtitleMl}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {currentJourney.stops.length} key locations
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-50 flex items-baseline gap-2">
            <span>{currentJourney.titleMl}</span>
            <span className="text-sm font-normal text-stone-500">({currentJourney.titleEn})</span>
          </h2>
          <p className="text-xs sm:text-sm font-scripture text-stone-700 dark:text-stone-300 leading-relaxed">
            {currentJourney.descriptionMl}
          </p>
        </div>

        {/* Action Button: Show Route on Map */}
        <button
          onClick={() => onSelectJourneyForMap(currentJourney)}
          className="shrink-0 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-900/20 hover:scale-105 transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>View Route on Map</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Itinerary Steps Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-500 px-1">
          Itinerary & Key Events (ഘട്ടങ്ങളും ചരിത്ര സംഭവങ്ങളും)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentJourney.stops.map((stop) => (
            <div
              key={stop.stopNumber}
              className="p-4 rounded-2xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/80 shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0"
                      style={{ backgroundColor: currentJourney.color }}
                    >
                      {stop.stopNumber}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {stop.placeNameMl}
                      </h4>
                      <span className="text-[11px] text-stone-400">({stop.placeNameEn})</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                    Stage {stop.stopNumber}
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
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
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
