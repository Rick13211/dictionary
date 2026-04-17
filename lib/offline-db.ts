import Dexie, { Table } from 'dexie';

export interface CachedWord {
  word: string;
  data: any;
  timestamp: number;
}

export class DictionaryDB extends Dexie {
  words!: Table<CachedWord>;

  constructor() {
    super('DictionaryDatabase');
    this.version(1).stores({
      words: 'word, timestamp' 
    });
  }
}

export const db = new DictionaryDB();
