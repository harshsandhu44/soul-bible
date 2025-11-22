export interface BibleTranslation {
  code: string;
  name: string;
  description: string;
}

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  {
    code: "kjv",
    name: "King James Version",
    description: "KJV - 1611 traditional English translation",
  },
  {
    code: "web",
    name: "World English Bible",
    description: "WEB - Modern English public domain translation",
  },
  {
    code: "asv",
    name: "American Standard Version",
    description: "ASV - 1901 American revision of KJV",
  },
  {
    code: "bbe",
    name: "Bible in Basic English",
    description: "BBE - Simple vocabulary translation",
  },
  {
    code: "clementine",
    name: "Clementine Vulgate",
    description: "Latin Vulgate - Official Latin text",
  },
];

export const FONT_SIZES = [
  { label: "Small", value: 16 },
  { label: "Medium", value: 18 },
  { label: "Large", value: 20 },
  { label: "Extra Large", value: 24 },
];
