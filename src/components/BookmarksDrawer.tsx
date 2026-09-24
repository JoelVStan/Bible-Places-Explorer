import React from 'react';
import { Place } from '../types';
import {
  Bookmark,
  X,
  Trash2,
} from 'lucide-react';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedPlaces: Place[];
  onSelectPlace: (place: Place) => void;
  onRemoveBookmark: (placeId: string) => void;
  onClearAll: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedPlaces,
  onSelectPlace,
  onRemoveBookmark,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-amber-50 dark:bg-stone-900 border-l border-amber-200 dark:border-stone-800 shadow-2xl flex flex-col text-stone-900 dark:text-stone-100 animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-5 border-b border-amber-200/60 dark:border-stone-800 bg-amber-100/40 dark:bg-stone-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-50">
                Saved Places (പ്രിയപ്പെട്ട സ്ഥലങ്ങൾ)
              </h3>
              <p className="text-[11px] text-stone-500">
                {bookmarkedPlaces.length} places bookmarked
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarkedPlaces.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-stone-800 flex items-center justify-center text-amber-600">
                <Bookmark className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-stone-700 dark:text-stone-200 text-sm">
                No saved places yet
              </h4>
              <p className="text-xs text-stone-400 max-w-xs">
                Click the bookmark icon on any biblical location in the interactive map or places directory to save it here for quick access.
              </p>
            </div>
          ) : (
            bookmarkedPlaces.map((place) => (
              <div
                key={place.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-2xs hover:border-amber-400 transition-colors group flex items-start justify-between gap-3"
              >
                <div
                  onClick={() => {
                    onSelectPlace(place);
                    onClose();
                  }}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                      {place.nameMl}
                    </h4>
                    <span className="text-xs text-stone-400">({place.nameEn})</span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                    {place.regionMl} • {place.modernCountryMl}
                  </p>
                  <p className="text-xs font-scripture text-stone-500 dark:text-stone-400 mt-1 line-clamp-1">
                    {place.briefDescriptionMl}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onRemoveBookmark(place.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {bookmarkedPlaces.length > 0 && (
          <div className="p-4 border-t border-amber-200/60 dark:border-stone-800 bg-amber-100/30 dark:bg-stone-900/40 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
