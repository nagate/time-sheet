import Dexie, { Table } from "dexie";

const DB_NAME = "timeSheetApp";
const VERSION = 1;

export interface Settings {
  id?: number;
  hourlyPay: number;
  breakTime: number;
  startWorkTime: Date | null;
  endWorkTime: Date | null;
  localUpdatedAt?: Date;
}

export interface TimeSheets {
  // unique key
  id: Date;
  // 検索効率化用
  yearMonth: string;
  breakTime: number;
  startWorkTime: Date | null;
  endWorkTime: Date | null;
  localUpdatedAt?: Date;
}

export class TimeSheetAppDexie extends Dexie {
  settings!: Table<Settings>;
  timeSheets!: Table<TimeSheets>;

  constructor() {
    super(DB_NAME);
    this.version(VERSION).stores({
      settings: "++id",
      timeSheets: "&id, yearMonth",
    });
  }
}

export const db = new TimeSheetAppDexie();
