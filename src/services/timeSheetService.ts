const DB_NAME = "myDatabase";
const STORE_NAME = "timeSheet";
const VERSION = 1;

export type TimeSheet = {
  id: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  breakTime: number;
};

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          // autoIncrement: true,
        });
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

export const getTimeSheet = async (id: string): Promise<TimeSheet | null> => {
  return transaction<string, TimeSheet | null>("readonly", "get", id);
};

export const insertTimeSheet = (data: TimeSheet): Promise<TimeSheet> => {
  return transaction<TimeSheet, TimeSheet>("readwrite", "add", data);
};

export const updateTimeSheet = (data: TimeSheet): Promise<TimeSheet> => {
  return transaction<TimeSheet, TimeSheet>("readwrite", "put", data);
};
