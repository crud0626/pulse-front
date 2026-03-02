import { isEqual } from 'lodash-es';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { searchHistoryItemSchema, type SearchHistoryItem } from '~/schemas';

interface SearchHistoryStore {
  searchHistories: SearchHistoryItem[];
  initialize: () => void;
  addHistory: (item: SearchHistoryItem) => void;
  removeHistory: (item: SearchHistoryItem) => void;
  clearHistories: () => void;
}

const STORAGE_KEY = 'searchHistory';
const MAX_ITEM_COUNT = 5;

function initSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];

  const storedRawData = window.localStorage.getItem(STORAGE_KEY);
  if (!storedRawData) return [];

  const storedHistories = JSON.parse(storedRawData);

  if (!Array.isArray(storedHistories)) {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }

  const validHistories = storedHistories.filter(
    (history) => searchHistoryItemSchema.safeParse(history).success,
  ) as SearchHistoryItem[];

  if (storedHistories.length !== validHistories.length) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validHistories));
  }

  return validHistories;
}

export const useSearchHistory = create<SearchHistoryStore>()(
  devtools((set, get) => ({
    searchHistories: [],

    initialize: () => {
      set((prev) => ({
        ...prev,
        searchHistories: initSearchHistory(),
      }));
    },

    addHistory: (item) => {
      const storedHistories = get().searchHistories;

      if (storedHistories.some((history) => isEqual(history, item))) {
        return;
      }

      storedHistories.unshift(item);

      const nextHistories = storedHistories.slice(0, MAX_ITEM_COUNT);

      set((prev) => ({
        ...prev,
        searchHistories: nextHistories,
      }));

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistories));
    },

    removeHistory: (targetItem) => {
      const storedHistories = get().searchHistories;
      const nextHistories = storedHistories
        .filter((historyItem) => !isEqual(historyItem, targetItem))
        .slice(0, MAX_ITEM_COUNT);

      set((prev) => ({
        ...prev,
        searchHistories: nextHistories,
      }));

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistories));
    },

    clearHistories: () => {
      set((prev) => ({
        ...prev,
        searchHistories: [],
      }));
      window.localStorage.removeItem(STORAGE_KEY);
    },
  })),
);
