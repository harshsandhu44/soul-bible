/**
 * Bible Service
 * Handles fetching random Bible verses from bible-api.com
 */

export interface BibleVerse {
  text: string;
  reference: string;
  translation: string;
}

export interface BibleBook {
  name: string;
  slug: string;
  chapters: number;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
  text: string;
}

// Curated list of inspirational Bible verses
const INSPIRATIONAL_VERSES = [
  'john 3:16',
  'philippians 4:13',
  'jeremiah 29:11',
  'proverbs 3:5-6',
  'romans 8:28',
  'psalm 23:1-4',
  'isaiah 41:10',
  'matthew 11:28',
  'joshua 1:9',
  'proverbs 16:3',
  'romans 12:2',
  'psalm 46:1',
  'john 14:6',
  'matthew 6:33',
  'psalm 118:24',
  'isaiah 40:31',
  'proverbs 18:10',
  'matthew 5:14-16',
  'romans 8:31',
  'psalm 27:1',
];

// Fallback verse in case API fails
const FALLBACK_VERSE: BibleVerse = {
  text: 'For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.',
  reference: 'Jeremiah 29:11',
  translation: 'ESV',
};

/**
 * Fetches a random Bible verse from bible-api.com
 * @param translation - Optional Bible translation code (e.g., 'kjv', 'web', 'asv'). Defaults to 'kjv'
 * @returns Promise<BibleVerse> - The Bible verse object
 */
export async function getRandomBibleVerse(
  translation: string = 'kjv'
): Promise<BibleVerse> {
  try {
    // Select a random verse from our curated list
    const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_VERSES.length);
    const verseReference = INSPIRATIONAL_VERSES[randomIndex];

    // Build URL with translation parameter
    const url = `https://bible-api.com/${encodeURIComponent(
      verseReference
    )}?translation=${translation}`;

    // Fetch from bible-api.com
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Parse and clean the verse text
    let verseText = data.text?.trim() || '';

    // Remove verse numbers (e.g., "1 ", "2 ") from the beginning of lines
    verseText = verseText.replace(/^\d+\s+/gm, '');

    // Remove extra whitespace and newlines
    verseText = verseText.replace(/\s+/g, ' ').trim();

    return {
      text: verseText,
      reference: data.reference || verseReference,
      translation: data.translation_name || 'KJV',
    };
  } catch (error) {
    console.error('Error fetching Bible verse:', error);
    // Return fallback verse on error
    return FALLBACK_VERSE;
  }
}

// Complete list of Bible books with chapter counts
const BIBLE_BOOKS: BibleBook[] = [
  // Old Testament
  { name: 'Genesis', slug: 'genesis', chapters: 50 },
  { name: 'Exodus', slug: 'exodus', chapters: 40 },
  { name: 'Leviticus', slug: 'leviticus', chapters: 27 },
  { name: 'Numbers', slug: 'numbers', chapters: 36 },
  { name: 'Deuteronomy', slug: 'deuteronomy', chapters: 34 },
  { name: 'Joshua', slug: 'joshua', chapters: 24 },
  { name: 'Judges', slug: 'judges', chapters: 21 },
  { name: 'Ruth', slug: 'ruth', chapters: 4 },
  { name: '1 Samuel', slug: '1samuel', chapters: 31 },
  { name: '2 Samuel', slug: '2samuel', chapters: 24 },
  { name: '1 Kings', slug: '1kings', chapters: 22 },
  { name: '2 Kings', slug: '2kings', chapters: 25 },
  { name: '1 Chronicles', slug: '1chronicles', chapters: 29 },
  { name: '2 Chronicles', slug: '2chronicles', chapters: 36 },
  { name: 'Ezra', slug: 'ezra', chapters: 10 },
  { name: 'Nehemiah', slug: 'nehemiah', chapters: 13 },
  { name: 'Esther', slug: 'esther', chapters: 10 },
  { name: 'Job', slug: 'job', chapters: 42 },
  { name: 'Psalms', slug: 'psalms', chapters: 150 },
  { name: 'Proverbs', slug: 'proverbs', chapters: 31 },
  { name: 'Ecclesiastes', slug: 'ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', slug: 'songofsolomon', chapters: 8 },
  { name: 'Isaiah', slug: 'isaiah', chapters: 66 },
  { name: 'Jeremiah', slug: 'jeremiah', chapters: 52 },
  { name: 'Lamentations', slug: 'lamentations', chapters: 5 },
  { name: 'Ezekiel', slug: 'ezekiel', chapters: 48 },
  { name: 'Daniel', slug: 'daniel', chapters: 12 },
  { name: 'Hosea', slug: 'hosea', chapters: 14 },
  { name: 'Joel', slug: 'joel', chapters: 3 },
  { name: 'Amos', slug: 'amos', chapters: 9 },
  { name: 'Obadiah', slug: 'obadiah', chapters: 1 },
  { name: 'Jonah', slug: 'jonah', chapters: 4 },
  { name: 'Micah', slug: 'micah', chapters: 7 },
  { name: 'Nahum', slug: 'nahum', chapters: 3 },
  { name: 'Habakkuk', slug: 'habakkuk', chapters: 3 },
  { name: 'Zephaniah', slug: 'zephaniah', chapters: 3 },
  { name: 'Haggai', slug: 'haggai', chapters: 2 },
  { name: 'Zechariah', slug: 'zechariah', chapters: 14 },
  { name: 'Malachi', slug: 'malachi', chapters: 4 },
  // New Testament
  { name: 'Matthew', slug: 'matthew', chapters: 28 },
  { name: 'Mark', slug: 'mark', chapters: 16 },
  { name: 'Luke', slug: 'luke', chapters: 24 },
  { name: 'John', slug: 'john', chapters: 21 },
  { name: 'Acts', slug: 'acts', chapters: 28 },
  { name: 'Romans', slug: 'romans', chapters: 16 },
  { name: '1 Corinthians', slug: '1corinthians', chapters: 16 },
  { name: '2 Corinthians', slug: '2corinthians', chapters: 13 },
  { name: 'Galatians', slug: 'galatians', chapters: 6 },
  { name: 'Ephesians', slug: 'ephesians', chapters: 6 },
  { name: 'Philippians', slug: 'philippians', chapters: 4 },
  { name: 'Colossians', slug: 'colossians', chapters: 4 },
  { name: '1 Thessalonians', slug: '1thessalonians', chapters: 5 },
  { name: '2 Thessalonians', slug: '2thessalonians', chapters: 3 },
  { name: '1 Timothy', slug: '1timothy', chapters: 6 },
  { name: '2 Timothy', slug: '2timothy', chapters: 4 },
  { name: 'Titus', slug: 'titus', chapters: 3 },
  { name: 'Philemon', slug: 'philemon', chapters: 1 },
  { name: 'Hebrews', slug: 'hebrews', chapters: 13 },
  { name: 'James', slug: 'james', chapters: 5 },
  { name: '1 Peter', slug: '1peter', chapters: 5 },
  { name: '2 Peter', slug: '2peter', chapters: 3 },
  { name: '1 John', slug: '1john', chapters: 5 },
  { name: '2 John', slug: '2john', chapters: 1 },
  { name: '3 John', slug: '3john', chapters: 1 },
  { name: 'Jude', slug: 'jude', chapters: 1 },
  { name: 'Revelation', slug: 'revelation', chapters: 22 },
];

/**
 * Get list of all Bible books with chapter counts
 * @returns BibleBook[] - Array of Bible books
 */
export function getBibleBooks(): BibleBook[] {
  return BIBLE_BOOKS;
}

/**
 * Fetches a chapter from the Bible API
 * @param book - Book slug (e.g., 'john', 'genesis')
 * @param chapter - Chapter number
 * @param translation - Bible translation code (e.g., 'kjv', 'web')
 * @returns Promise<BibleChapter> - The Bible chapter object
 */
export async function getChapter(
  book: string,
  chapter: number,
  translation: string = 'kjv'
): Promise<BibleChapter> {
  try {
    // Construct the reference (e.g., "john 3" or "1samuel 5")
    const reference = `${book} ${chapter}`;
    const url = `https://bible-api.com/${encodeURIComponent(
      reference
    )}?translation=${translation}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Parse verses from the response
    const verses: BibleVerse[] = data.verses?.map((v: any) => ({
      text: v.text?.trim() || '',
      reference: v.verse?.toString() || '',
      translation: data.translation_name || translation.toUpperCase(),
    })) || [];

    // Clean the full chapter text
    let chapterText = data.text?.trim() || '';
    chapterText = chapterText.replace(/^\d+\s+/gm, '');

    return {
      book: data.reference?.split(' ')[0] || book,
      chapter,
      verses,
      text: chapterText,
    };
  } catch (error) {
    console.error('Error fetching chapter:', error);
    throw error;
  }
}
