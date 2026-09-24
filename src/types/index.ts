export type Testament = 'OT' | 'NT' | 'BOTH';

export interface VerseReference {
  bookId: string;
  bookName: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  textMalayalam: string; // Preloaded or fetched verse text
  explanation?: string;
}

export interface BiblicalEvent {
  title: string;
  era: string; // e.g., 'BC 2000', 'AD 30'
  description: string;
  verseRef?: string;
}

export interface Place {
  id: string;
  nameMl: string; // Malayalam name: e.g. "യെരൂശലേം"
  nameEn: string; // English name: e.g. "Jerusalem"
  alternateNamesMl?: string[];
  lat: number;
  lng: number;
  testament: Testament;
  category: 'holy_city' | 'city' | 'mountain' | 'water' | 'region' | 'tomb' | 'desert';
  regionMl: string; // e.g. "യൂദെയ", "ഗലീല", "റോമാ സാമ്രാജ്യം"
  modernCountryMl: string; // e.g. "ഇസ്രായേൽ / പലസ്തീൻ"
  modernNameMl: string; // Modern city name in Malayalam
  briefDescriptionMl: string;
  detailedHistoryMl: string;
  significanceMl: string;
  keyEvents: BiblicalEvent[];
  verses: VerseReference[];
  imageUrl?: string;
  elevation?: string;
}

export interface JourneyStop {
  stopNumber: number;
  placeId: string;
  placeNameMl: string;
  placeNameEn: string;
  lat: number;
  lng: number;
  descriptionMl: string;
  bibleReferenceMl: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

export interface Journey {
  id: string;
  titleMl: string;
  titleEn: string;
  type: 'paul' | 'jesus';
  subtitleMl: string;
  color: string;
  descriptionMl: string;
  stops: JourneyStop[];
}

export interface TimelineItem {
  id: string;
  year: string;
  titleMl: string;
  titleEn: string;
  placeId: string;
  placeNameMl: string;
  testament: Testament;
  descriptionMl: string;
  verseMl: string;
  bookId: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

export interface BibleChapterTitle {
  after: number;
  text: string;
}

export interface BibleChapter {
  chapterId: string;
  titles: BibleChapterTitle[];
  verses: string[];
}

export interface BibleBook {
  bookId: string;
  name: string;
  testamentId?: string;
  chapters: BibleChapter[];
}
