const STORES = ['temperatures'];

class Database {
    _connected = false;
    _db = false;

    constructor() {
        console.log('constructor');
    }

    connect(databaseName) {
        const self = this;
        return new Promise(function (resolve, reject) {
            try {
                const version = 1;
                const request = indexedDB.open(databaseName, version);

                // Migrations
                request.onupgradeneeded = e => {
                    console.log('Upgrade needed ', e.target.result);
                    self._db = e.target.result;
                    STORES.map(store => self.createStoreIfNotExist(store));
                };

                request.onsuccess = e => {
                    console.log('DB connect request success ', e.target.result);
                    self._connected = true;
                    self._db = e.target.result;
                    resolve(self);
                };

                request.onerror = self.onError;

            } catch (e) {
                return reject(e);
            }
        });
    }

    onError = err => {
        console.log('DB error ', err);
    };

    createStoreIfNotExist = (storeName) => {
        if (storeName) {
            if (!this._db.objectStoreNames.contains(storeName)) {
                console.log('createStoreIfNotExist ', storeName);
                this._db.createObjectStore(storeName);
            } else {
                console.log('createStoreIfNotExist ', this._db.objectStoreNames);
            }
        }
    };

    create(storeName, data) {
        const self = this;

        return new Promise(function (resolve, reject) {
            // Check if store exist
            self.createStoreIfNotExist(storeName);
            // TSR OO format
            const transaction = self._db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data, 1);
            request.oncomplete = e => resolve(self);
            request.onerror = reject;
        });
    }

    read = (storeName) => {
        const self = this;
        return new Promise(function (resolve, reject) {
            const transaction = self._db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const keyRange = IDBKeyRange.lowerBound(0);
            const cursorRequest = store.openCursor(keyRange);

            const data = [];
            cursorRequest.onsuccess = e => {
                const result = e.target?.result;
                if (result) {
                    data.push(e.target.result.value);
                    result.continue();
                } else {
                    console.log('read data ', data);
                    resolve(data);
                }
            };

            cursorRequest.onerror = reject;
        });
    };

    update(storeName, data) {
        const self = this;

        return new Promise(async function (resolve, reject) {
            // Check if store exist
            self.createStoreIfNotExist(storeName);
            // TSR OO format
            const transaction = self._db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            let request = null;
            // Create or Update
            if (self._db.objectStoreNames.contains(storeName)) {
                request = store.put(data, 1);
            } else {
                request = store.add(data, 1);
            }
            request.oncomplete = e => resolve(self);
            request.onerror = reject;
        });
    }

    delete(storeName, id) {
        const self = this;

        return new Promise(function (resolve, reject) {
            const transaction = self._db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const deleteRequest = store.delete(id);
            deleteRequest.onsuccess = () => resolve(self);
            deleteRequest.onerror = reject;
        })
    }
}

// const database = new Database();
// database.connect('temperature_units').then(db => db.read('temperatures')).then(data => console.log(data));
// database.connect('temperature_units').then(db => db.create('temperatures', {unit_id: 'unit 00',  temperature: -1}));
// database.connect('temperature_units').then(db => db.delete('temperatures', {unit_id: 'unit 00'}));
