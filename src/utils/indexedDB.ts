// utils/indexedDB.ts
const dbName = 'myDatabase';
const storeName = 'myStore';

export function initDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => {
      const db = (request.result as IDBDatabase);
      resolve(db);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

// utils/indexedDB.ts
interface IData {
  id?: number;
  email: string;
  password: string;
}

export function addData(data: IData): Promise<number> {
  return new Promise((resolve, reject) => {
    const request = initDatabase();

    request.then((db) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);

      const addRequest = store.add(data);

      addRequest.onsuccess = () => {
        resolve((addRequest.result as number));
      };

      addRequest.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    }).catch((error) => {
      reject(error);
    });
  });
}
