import React, { useEffect, useState, useRef } from 'react';
import { BibleService, BIBLE_BOOKS_MAP } from '../services/bibleService';
import { BibleChapter } from '../types';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Copy,
  Check,
  Loader2,
} from 'lucide-react';

interface FullChapterReaderProps {
  bookId: string;
  chapterNumber: number;
  highlightVerse?: number;
  onClose: () => void;
  onNavigateChapter?: (bookId: string, chapter: number) => void;
}

export const FullChapterReader: React.FC<FullChapterReaderProps> = ({
  bookId,
  chapterNumber,
  highlightVerse,
  onClose,
  onNavigateChapter,
}) => {
  const [loading, setLoading] = useState(true);
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('large');
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const highlightRef = useRef<HTMLDivElement>(null);

  const bookMeta = BIBLE_BOOKS_MAP[bookId];
  const bookNameMl = bookMeta ? bookMeta.nameMl : `Book ${bookId}`;
  const totalChapters = bookMeta ? bookMeta.chaptersCount : 50;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    BibleService.getChapter(bookId, chapterNumber)
      .then((data) => {
        if (!isMounted) return;
        if (data) {
          setChapterData(data);
          setLoading(false);
          // Auto-scroll to highlighted verse after render
          setTimeout(() => {
            highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        } else {
          setErrorMsg('Chapter not found in database.');
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setErrorMsg('Error loading scripture text: ' + err.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [bookId, chapterNumber]);

  const handleNextChapter = () => {
    if (chapterNumber < totalChapters) {
      onNavigateChapter?.(bookId, chapterNumber + 1);
    }
  };

  const handlePrevChapter = () => {
    if (chapterNumber > 1) {
      onNavigateChapter?.(bookId, chapterNumber - 1);
    }
  };

  const handleCopySingleVerse = (verseNum: number, text: string) => {
    const textToCopy = `"${text}" (${bookNameMl} ${chapterNumber}:${verseNum}) - സത്യവേദപുസ്തകം (Malayalam Holy Bible)`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerse(verseNum);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const handleCopyWholeChapter = () => {
    if (!chapterData) return;
    const allText = chapterData.verses
      .map((v, i) => `${i + 1}. ${v}`)
      .join('\n\n');
    navigator.clipboard.writeText(`${bookNameMl} - അദ്ധ്യായം ${chapterNumber}\n\n${allText}`);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94dvh] sm:max-h-[92vh] bg-amber-50/98 dark:bg-stone-900/98 rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-amber-200 dark:border-stone-800 flex flex-col overflow-hidden text-stone-900 dark:text-stone-100">
        {/* Subtle mobile sheet drag indicator */}
        <div className="w-10 h-1 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-3.5 sm:px-5 py-3 sm:py-4 border-b border-amber-200/60 dark:border-stone-800 bg-amber-100/50 dark:bg-stone-800/50 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-xl font-bold text-stone-900 dark:text-stone-50 leading-tight truncate">
                {bookNameMl} - {chapterNumber}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 truncate">
                സത്യവേദപുസ്തകം (Malayalam Bible)
              </p>
            </div>
          </div>

          {/* Action buttons (Font zoom, Copy, Close) */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Font size switcher */}
            <div className="flex items-center bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-0.5">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded font-medium cursor-pointer ${
                  fontSize === 'normal'
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-600 dark:text-stone-300'
                }`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded font-medium cursor-pointer ${
                  fontSize === 'large'
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-600 dark:text-stone-300'
                }`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xl')}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs rounded font-medium cursor-pointer ${
                  fontSize === 'xl'
                    ? 'bg-amber-600 text-white'
                    : 'text-stone-600 dark:text-stone-300'
                }`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* Copy full chapter */}
            <button
              onClick={handleCopyWholeChapter}
              className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 transition-colors cursor-pointer active:scale-95"
              title="Copy entire chapter"
            >
              {copiedAll ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 transition-colors cursor-pointer active:scale-95"
              title="Close reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
          {loading && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Fetching scripture text...
              </p>
              <p className="text-xs text-stone-400 max-w-sm">
                Loading authentic Malayalam Bible scriptures...
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900">
              <p className="font-semibold text-sm">{errorMsg}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && chapterData && (
            <article className="max-w-3xl mx-auto space-y-4">
              {/* Chapter Titles */}
              {chapterData.titles &&
                chapterData.titles.map((t, idx) => (
                  <div
                    key={idx}
                    className="text-center pb-2 border-b border-amber-200/50 dark:border-stone-800"
                  >
                    <h4 className="text-base sm:text-lg font-bold font-scripture text-amber-800 dark:text-amber-300">
                      {t.text}
                    </h4>
                  </div>
                ))}

              {/* Verses List */}
              <div
                className={`font-scripture leading-relaxed space-y-3.5 ${
                  fontSize === 'normal'
                    ? 'text-sm sm:text-base'
                    : fontSize === 'large'
                    ? 'text-base sm:text-lg'
                    : 'text-lg sm:text-xl'
                }`}
              >
                {chapterData.verses.map((verseText, idx) => {
                  const verseNumber = idx + 1;
                  const isHighlighted = highlightVerse === verseNumber;

                  return (
                    <div
                      key={idx}
                      ref={isHighlighted ? highlightRef : null}
                      className={`group p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                        isHighlighted
                          ? 'bg-amber-200/60 dark:bg-amber-950/60 border-l-4 border-amber-600 shadow-sm'
                          : 'hover:bg-amber-100/30 dark:hover:bg-stone-800/40'
                      }`}
                    >
                      <span className="font-mono text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 select-none pt-0.5 shrink-0 w-6 text-right">
                        {verseNumber}
                      </span>
                      <p className="flex-1 text-stone-800 dark:text-stone-200 text-justify">
                        {verseText}
                      </p>
                      <button
                        onClick={() => handleCopySingleVerse(verseNumber, verseText)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-400 transition-opacity shrink-0"
                        title="Copy this verse"
                      >
                        {copiedVerse === verseNumber ? (
                          <Check className="w-3.5 h-3.5 text-green-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </article>
          )}
        </div>

        {/* Footer Navigation (Prev Chapter / Next Chapter) */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3 border-t border-amber-200/60 dark:border-stone-800 bg-amber-50/70 dark:bg-stone-900/70 flex items-center justify-between text-xs pb-[max(0.75rem,env(safe-area-inset-bottom))] gap-2">
          <button
            onClick={handlePrevChapter}
            disabled={chapterNumber <= 1}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors font-medium cursor-pointer active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous Chapter ({chapterNumber - 1})</span>
            <span className="sm:hidden">Ch {chapterNumber - 1}</span>
          </button>

          <span className="text-stone-500 font-medium text-[11px] sm:text-xs text-center shrink-0">
            {chapterNumber} / {totalChapters}
          </span>

          <button
            onClick={handleNextChapter}
            disabled={chapterNumber >= totalChapters}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors font-medium cursor-pointer active:scale-95"
          >
            <span className="hidden sm:inline">Next Chapter ({chapterNumber + 1})</span>
            <span className="sm:hidden">Ch {chapterNumber + 1}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
