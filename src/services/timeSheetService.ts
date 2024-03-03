import { TimeSheet } from "@/types/timeSheetType";
import datetimeUtil from "@/utils/datetime";

const DB_NAME = "myDatabase";
const STORE_NAME = "timeSheet";
const VERSION = 2;

const INDEX_YEAR_MONTH = "yearMonth";

// export type TimeSheet = {
//   id: string;
//   date: Date;
//   year?: string;
//   month?: string;
//   yearMonth?: string;
//   day?: string;
//   startTime?: Date;
//   endTime?: Date;
//   breakTime: number;
// };

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // TODO: pkをyyyy,mm,ddに変更する
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: false,
        });
        store.createIndex(INDEX_YEAR_MONTH, INDEX_YEAR_MONTH, {
          unique: false,
        });
        // store.createIndex("month", "month", { unique: false });
        // store.createIndex("day", "day", { unique: false });
      }
    };

    request.onsuccess = () => {
      const db = request.result as IDBDatabase;
      resolve(db);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

const transaction = <T, U>(
  mode: IDBTransactionMode,
  funcName: string,
  args: T
): Promise<U> => {
  return new Promise((resolve, reject) => {
    const request = initDB();
    request.then((db) => {
      const transaction = db.transaction([STORE_NAME], mode);
      const store = transaction.objectStore(STORE_NAME);

      // const result = func(store, args);
      let result: IDBRequest<any>;
      if (funcName === "get") {
        result = store.get(args as string);
      } else if (funcName === "add") {
        result = store.add(args);
      } else if (funcName === "put") {
        result = store.put(args);
      } else if (funcName === "getByYearMonth") {
        const _idx = store.index(INDEX_YEAR_MONTH);
        result = _idx.getAll(args as string);
      } else {
        result = store.get(args as string);
      }

      result.onsuccess = (event) => {
        console.log(result);
        transaction.commit();
        db.close();
        resolve(result.result as U);
        // r = result.result;
      };

      result.onerror = (event) => {
        reject((event.target as IDBRequest).error);
        // throw event.target.error;
      };
    });

    request.catch((e) => {
      console.error(e);
      throw e;
    });
  });
};

const getIndex = (date: Date) => {
  const year = datetimeUtil.getFormattedDatetime({
    date: date,
    format: "yyyy",
    zeroFilled: true,
  });

  const month = datetimeUtil.getFormattedDatetime({
    date: date,
    format: "MM",
    zeroFilled: true,
  });

  const yearMonth = datetimeUtil.getFormattedDatetime({
    date: date,
    format: "yyyyMM",
    zeroFilled: true,
  });

  const day = datetimeUtil.getFormattedDatetime({
    date: date,
    format: "dd",
    zeroFilled: true,
  });
  return { year, month, yearMonth, day };
};

export const getTimeSheet = async (id: string): Promise<TimeSheet | null> => {
  return transaction<string, TimeSheet | null>("readonly", "get", id);
};

export const getTimeSheetByYearMonth = (
  yearMonth: string
): Promise<TimeSheet[]> => {
  return transaction<string, TimeSheet[]>(
    "readonly",
    "getByYearMonth",
    yearMonth
  );
};

export const insertTimeSheet = (data: TimeSheet): Promise<TimeSheet> => {
  const { year, month, yearMonth, day } = getIndex(data.date);
  const d = { year, month, yearMonth, day, ...data };
  return transaction<TimeSheet, TimeSheet>("readwrite", "add", d);
};

export const bulkInsertTimeSheet = (dates: Date[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    const d: TimeSheet[] = [];
    for (let i = 0; i < dates.length; i++) {
      const { year, month, yearMonth, day } = getIndex(dates[i]);
      // d.push({
      //   id: `${year}${month}${day}`,
      //   date: dates[i],
      //   year,
      //   month,
      //   yearMonth,
      //   day,
      //   breakTime: 0,
      // });

      transaction<TimeSheet, TimeSheet>("readwrite", "put", {
        id: `${year}${month}${day}`,
        date: dates[i],
        year,
        month,
        yearMonth,
        day,
        breakTime: 0,
      });
    }
    // return transaction<TimeSheet[], TimeSheet[]>("readwrite", "put", d);
    resolve();
  });
};

export const insertMonthTimeSheet = (
  year: number,
  month: number
): Promise<void> => {
  const date = datetimeUtil.createMonthDates(Number(year), Number(month));
  console.table(date);

  return bulkInsertTimeSheet(date);
};

export const updateTimeSheet = (data: TimeSheet): Promise<TimeSheet> => {
  const { year, month, yearMonth, day } = getIndex(data.date);
  const d = { year, month, yearMonth, day, ...data };
  return transaction<TimeSheet, TimeSheet>("readwrite", "put", d);
};
