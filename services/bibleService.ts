/**
 * Bible Service
 * Handles fetching random Bible verses from bible-api.com
 */

export interface BibleVerse {
  text: string;
  reference: string;
  translation: string;
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
 * @returns Promise<BibleVerse> - The Bible verse object
 */
export async function getRandomBibleVerse(): Promise<BibleVerse> {
  try {
    // Select a random verse from our curated list
    const randomIndex = Math.floor(Math.random() * INSPIRATIONAL_VERSES.length);
    const verseReference = INSPIRATIONAL_VERSES[randomIndex];

    // Fetch from bible-api.com
    const response = await fetch(
      `https://bible-api.com/${encodeURIComponent(verseReference)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

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
