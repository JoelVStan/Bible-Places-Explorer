/**
 * Bible Service for Malayalam Holy Bible
 * Source of truth: https://github.com/jjkavalam/holy_bible
 * Raw JSON: https://raw.githubusercontent.com/jjkavalam/holy_bible/main/holy_bible.json
 */

import { BibleBook, BibleChapter } from '../types';

const BIBLE_JSON_URL = 'https://raw.githubusercontent.com/jjkavalam/holy_bible/main/holy_bible.json';
const DB_NAME = 'malayalam_bible_cache_v1';
const STORE_NAME = 'bible_books';

// Cache in memory for fast lookup
let inMemoryBooks: BibleBook[] | null = null;
let fetchPromise: Promise<BibleBook[]> | null = null;

// Book metadata mapping
export const BIBLE_BOOKS_MAP: Record<string, { id: string; nameMl: string; testament: 'OT' | 'NT'; chaptersCount: number }> = {
  '1': { id: '1', nameMl: 'ഉല്‍‍പത്തി', testament: 'OT', chaptersCount: 50 },
  '2': { id: '2', nameMl: 'പുറപ്പാട്', testament: 'OT', chaptersCount: 40 },
  '3': { id: '3', nameMl: 'ലേവ്യര്‍', testament: 'OT', chaptersCount: 27 },
  '4': { id: '4', nameMl: 'സംഖ്യ', testament: 'OT', chaptersCount: 36 },
  '5': { id: '5', nameMl: 'നിയമാവര്‍ത്തനം', testament: 'OT', chaptersCount: 34 },
  '6': { id: '6', nameMl: 'ജോഷ്വാ', testament: 'OT', chaptersCount: 24 },
  '7': { id: '7', nameMl: 'ന്യായാധിപ‌ന്‍‍മാര്‍', testament: 'OT', chaptersCount: 21 },
  '8': { id: '8', nameMl: 'റൂത്ത്', testament: 'OT', chaptersCount: 4 },
  '9': { id: '9', nameMl: '1 സാമുവല്‍', testament: 'OT', chaptersCount: 31 },
  '10': { id: '10', nameMl: '2 സാമുവല്‍', testament: 'OT', chaptersCount: 24 },
  '11': { id: '11', nameMl: '1 രാജാക്ക‌ന്‍‍മാര്‍', testament: 'OT', chaptersCount: 22 },
  '12': { id: '12', nameMl: '2 രാജാക്ക‌ന്‍‍മാര്‍', testament: 'OT', chaptersCount: 25 },
  '13': { id: '13', nameMl: '1 ദിനവൃത്താന്തം', testament: 'OT', chaptersCount: 29 },
  '14': { id: '14', nameMl: '2 ദിനവൃത്താന്തം', testament: 'OT', chaptersCount: 36 },
  '15': { id: '15', nameMl: 'എസ്രാ', testament: 'OT', chaptersCount: 10 },
  '16': { id: '16', nameMl: 'നെഹമിയ', testament: 'OT', chaptersCount: 13 },
  '17': { id: '17', nameMl: 'തോബിത്', testament: 'OT', chaptersCount: 14 },
  '18': { id: '18', nameMl: 'യൂദിത്ത്', testament: 'OT', chaptersCount: 16 },
  '19': { id: '19', nameMl: 'എസ്തേര്‍', testament: 'OT', chaptersCount: 10 },
  '20': { id: '20', nameMl: '1 മക്കബായര്‍', testament: 'OT', chaptersCount: 16 },
  '21': { id: '21', nameMl: '2 മക്കബായര്‍', testament: 'OT', chaptersCount: 15 },
  '22': { id: '22', nameMl: 'ജോബ്', testament: 'OT', chaptersCount: 42 },
  '23': { id: '23', nameMl: 'സങ്കീര്‍ത്തനങ്ങള്‍', testament: 'OT', chaptersCount: 150 },
  '24': { id: '24', nameMl: 'സുഭാഷിതങ്ങള്‍', testament: 'OT', chaptersCount: 31 },
  '25': { id: '25', nameMl: 'സഭാപ്രസംഗക‌ന്‍', testament: 'OT', chaptersCount: 12 },
  '26': { id: '26', nameMl: 'ഉത്തമഗീതം', testament: 'OT', chaptersCount: 8 },
  '27': { id: '27', nameMl: 'ജ്ഞാനം', testament: 'OT', chaptersCount: 19 },
  '28': { id: '28', nameMl: 'പ്രഭാഷക‌ന്‍', testament: 'OT', chaptersCount: 51 },
  '29': { id: '29', nameMl: 'ഏശയ്യാ', testament: 'OT', chaptersCount: 66 },
  '30': { id: '30', nameMl: 'ജെറെമിയ', testament: 'OT', chaptersCount: 52 },
  '31': { id: '31', nameMl: 'വിലാപങ്ങള്‍', testament: 'OT', chaptersCount: 5 },
  '32': { id: '32', nameMl: 'ബാറൂക്ക്', testament: 'OT', chaptersCount: 6 },
  '33': { id: '33', nameMl: 'എസെക്കിയേല്‍', testament: 'OT', chaptersCount: 48 },
  '34': { id: '34', nameMl: 'ദാനിയേല്‍', testament: 'OT', chaptersCount: 14 },
  '35': { id: '35', nameMl: 'ഹോസിയാ', testament: 'OT', chaptersCount: 14 },
  '36': { id: '36', nameMl: 'ജോയേല്‍', testament: 'OT', chaptersCount: 4 },
  '37': { id: '37', nameMl: 'ആമോസ്', testament: 'OT', chaptersCount: 9 },
  '38': { id: '38', nameMl: 'ഒബാദിയ', testament: 'OT', chaptersCount: 1 },
  '39': { id: '39', nameMl: 'യോനാ', testament: 'OT', chaptersCount: 4 },
  '40': { id: '40', nameMl: 'മിക്കാ', testament: 'OT', chaptersCount: 7 },
  '41': { id: '41', nameMl: 'നാഹും', testament: 'OT', chaptersCount: 3 },
  '42': { id: '42', nameMl: 'ഹബക്കുക്ക്', testament: 'OT', chaptersCount: 3 },
  '43': { id: '43', nameMl: 'സെഫാനിയ', testament: 'OT', chaptersCount: 3 },
  '44': { id: '44', nameMl: 'ഹഗ്ഗായി', testament: 'OT', chaptersCount: 2 },
  '45': { id: '45', nameMl: 'സഖറിയാ', testament: 'OT', chaptersCount: 14 },
  '46': { id: '46', nameMl: 'മലാക്കി', testament: 'OT', chaptersCount: 3 },
  '47': { id: '47', nameMl: 'മത്തായി', testament: 'NT', chaptersCount: 28 },
  '48': { id: '48', nameMl: 'മര്‍ക്കോസ്', testament: 'NT', chaptersCount: 16 },
  '49': { id: '49', nameMl: 'ലൂക്കാ', testament: 'NT', chaptersCount: 24 },
  '50': { id: '50', nameMl: 'യോഹന്നാ‌ന്‍', testament: 'NT', chaptersCount: 21 },
  '51': { id: '51', nameMl: 'അപ്പ. പ്രവര്‍ത്തനങ്ങള്‍', testament: 'NT', chaptersCount: 28 },
  '52': { id: '52', nameMl: 'റോമാ', testament: 'NT', chaptersCount: 16 },
  '53': { id: '53', nameMl: '1 കൊറിന്തോസ്', testament: 'NT', chaptersCount: 16 },
  '54': { id: '54', nameMl: '2 കൊറിന്തോസ്', testament: 'NT', chaptersCount: 13 },
  '55': { id: '55', nameMl: 'ഗലാത്തിയാ', testament: 'NT', chaptersCount: 6 },
  '56': { id: '56', nameMl: 'എഫേസോസ്', testament: 'NT', chaptersCount: 6 },
  '57': { id: '57', nameMl: 'ഫിലിപ്പി', testament: 'NT', chaptersCount: 4 },
  '58': { id: '58', nameMl: 'കൊളോസോസ്', testament: 'NT', chaptersCount: 4 },
  '59': { id: '59', nameMl: '1 തെസലോനിക്കാ', testament: 'NT', chaptersCount: 5 },
  '60': { id: '60', nameMl: '2 തെസലോനിക്കാ', testament: 'NT', chaptersCount: 3 },
  '61': { id: '61', nameMl: '1 തിമോത്തേയോസ്', testament: 'NT', chaptersCount: 6 },
  '62': { id: '62', nameMl: '2 തിമോത്തേയോസ്', testament: 'NT', chaptersCount: 4 },
  '63': { id: '63', nameMl: 'തീത്തോസ്', testament: 'NT', chaptersCount: 3 },
  '64': { id: '64', nameMl: 'ഫിലെമോ‌ന്‍', testament: 'NT', chaptersCount: 1 },
  '65': { id: '65', nameMl: 'ഹെബ്രായര്‍', testament: 'NT', chaptersCount: 13 },
  '66': { id: '66', nameMl: 'യാക്കോബ്', testament: 'NT', chaptersCount: 5 },
  '67': { id: '67', nameMl: '1 പത്രോസ്', testament: 'NT', chaptersCount: 5 },
  '68': { id: '68', nameMl: '2 പത്രോസ്', testament: 'NT', chaptersCount: 3 },
  '69': { id: '69', nameMl: '1 യോഹന്നാ‌ന്‍', testament: 'NT', chaptersCount: 5 },
  '70': { id: '70', nameMl: '2 യോഹന്നാ‌ന്‍', testament: 'NT', chaptersCount: 1 },
  '71': { id: '71', nameMl: '3 യോഹന്നാ‌ന്‍', testament: 'NT', chaptersCount: 1 },
  '72': { id: '72', nameMl: 'യുദാസ്', testament: 'NT', chaptersCount: 1 },
  '73': { id: '73', nameMl: 'വെളിപാട്', testament: 'NT', chaptersCount: 22 },
};

// IndexedDB Helper
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'bookId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function loadFromDB(): Promise<BibleBook[] | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        if (req.result && req.result.length > 50) {
          resolve(req.result as BibleBook[]);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveToDB(books: BibleBook[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const b of books) {
      store.put(b);
    }
  } catch (err) {
    console.warn('Failed saving bible to IndexedDB:', err);
  }
}

export class BibleService {
  /**
   * Loads the complete Malayalam Bible JSON from GitHub or local IndexedDB cache
   */
  static async loadBible(onProgress?: (msg: string) => void): Promise<BibleBook[]> {
    if (inMemoryBooks) return inMemoryBooks;
    if (fetchPromise) return fetchPromise;

    fetchPromise = (async () => {
      // 1. Try local IndexedDB
      try {
        onProgress?.('ലോക്കൽ കാഷിൽ പരിശോധിക്കുന്നു...');
        const cached = await loadFromDB();
        if (cached && cached.length >= 66) {
          inMemoryBooks = cached;
          onProgress?.('ബൈബിൾ ഉള്ളടക്കം തയ്യാറാണ്');
          return inMemoryBooks;
        }
      } catch {
        // Continue to network
      }

      // 2. Fetch from GitHub repository
      try {
        onProgress?.('ബൈബിൾ വേദഭാഗങ്ങൾ ഡൗൺലോഡ് ചെയ്യുന്നു...');
        const response = await fetch(BIBLE_JSON_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch Bible JSON: ${response.status}`);
        }
        const data: BibleBook[] = await response.json();
        inMemoryBooks = data;
        onProgress?.('ഡാറ്റ സംഭരിക്കുന്നു...');
        saveToDB(data).catch(() => {});
        return inMemoryBooks;
      } catch (err) {
        console.error('Error fetching Malayalam Bible from GitHub:', err);
        throw err;
      }
    })();

    return fetchPromise;
  }

  /**
   * Normalize search query or book name to bookId
   */
  static findBookId(bookNameOrId: string): string | null {
    const clean = bookNameOrId.trim().toLowerCase();
    if (BIBLE_BOOKS_MAP[clean]) return clean;

    for (const [id, meta] of Object.entries(BIBLE_BOOKS_MAP)) {
      const metaName = meta.nameMl.replace(/[\u200C\u200D\s]/g, '').toLowerCase();
      const target = clean.replace(/[\u200C\u200D\s]/g, '').toLowerCase();
      if (metaName.includes(target) || target.includes(metaName)) {
        return id;
      }
    }
    return null;
  }

  /**
   * Retrieves chapter verses and titles from memory or remote
   */
  static async getChapter(bookIdOrName: string, chapterNumber: number): Promise<BibleChapter | null> {
    const bookId = this.findBookId(bookIdOrName) || bookIdOrName;
    const books = inMemoryBooks || (await this.loadBible());
    const book = books.find((b) => b.bookId === bookId);
    if (!book || !book.chapters) return null;

    const chapter = book.chapters.find((c) => parseInt(c.chapterId, 10) === chapterNumber);
    return chapter || null;
  }

  /**
   * Fetch specific verses range
   */
  static async getVerses(
    bookIdOrName: string,
    chapterNumber: number,
    startVerse: number,
    endVerse?: number
  ): Promise<{ reference: string; text: string; versesList: { num: number; text: string }[] }> {
    const bookId = this.findBookId(bookIdOrName) || bookIdOrName;
    const meta = BIBLE_BOOKS_MAP[bookId];
    const bookTitle = meta ? meta.nameMl : bookIdOrName;

    const chapter = await this.getChapter(bookId, chapterNumber);
    if (!chapter) {
      return {
        reference: `${bookTitle} ${chapterNumber}:${startVerse}${endVerse ? '-' + endVerse : ''}`,
        text: 'വാക്യം ലഭ്യമാക്കാൻ കഴിഞ്ഞില്ല.',
        versesList: [],
      };
    }

    const startIdx = Math.max(0, startVerse - 1);
    const endIdx = endVerse ? Math.min(chapter.verses.length, endVerse) : startIdx + 1;
    const selectedVerses = chapter.verses.slice(startIdx, endIdx);

    const versesList = selectedVerses.map((text, i) => ({
      num: startVerse + i,
      text,
    }));

    const text = selectedVerses.join(' ');
    const reference = `${bookTitle} ${chapterNumber}:${startVerse}${endVerse && endVerse > startVerse ? '-' + endVerse : ''}`;

    return { reference, text, versesList };
  }

  /**
   * Get book name in Malayalam
   */
  static getBookNameMl(bookId: string): string {
    return BIBLE_BOOKS_MAP[bookId]?.nameMl || bookId;
  }
}
