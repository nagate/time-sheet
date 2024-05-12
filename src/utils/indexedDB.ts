// utils/indexedDB.ts
const dbName = "myDatabase";
const storeName = "myStore";
const timeSheetStore = "timeSheet";

// TODO: 当ファイルは削除する

export function initDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(timeSheetStore)) {
        db.createObjectStore(timeSheetStore, {
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
}

// utils/indexedDB.ts
interface TimeSheet {
  warkDay: Date;
  start: Date;
  end: Date;
  breakTime: number;
}

interface IData {
  id?: number;
  email: string;
  password: string;
  timeSheet: TimeSheet[];
}

export function addData(data: IData): Promise<number> {
  return new Promise((resolve, reject) => {
    const request = initDatabase();

    request
      .then((db) => {
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);

        const addRequest = store.add(data);

        addRequest.onsuccess = () => {
          resolve(addRequest.result as number);
        };

        addRequest.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// export const addTimeSheet = (data: IData): Promise<number> => {
//   return addData(data);
// };
