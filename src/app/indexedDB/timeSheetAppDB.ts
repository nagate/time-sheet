import Dexie, { Table } from "dexie";

export interface Settings {
  id?: number;
  hourlyPay: number;
  breakTime: number;
  startWorkTime: Date | null;
  endWorkTime: Date | null;
  localUpdatedAt?: Date;
}

export interface TimeSheets {
  // id: string;
  // unique key
  day: Date;
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
    super("timeSheetApp");
    this.version(1).stores({
      // settings: "++id, name, age", // Primary key and indexed props
      settings: "++id",
      timeSheets: "&day, yearMonth",
    });
  }
}

export const db = new TimeSheetAppDexie();
