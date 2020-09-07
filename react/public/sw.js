importScripts('/js/idb.js');


const STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',

    '/images/no-image.png'
];
const STATIC_CACHE_NAME = 'static-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';
const DB_NAME = 'temperature_units';

self.addEventListener('install', function (event) {
    console.log('Service worker installed', event);
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(function (cache) {
                cache.addAll(STATIC_FILES)
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log('Service worker activated -remove old caches', event);
});

self.addEventListener('fetch', function (event) {
    if (event.request.url.includes('api/v1')) {
        console.log('DATA METHOD PART from online METHOD : ', event.request.method);
        event.respondWith(
            fetch(event.request.url)                                                        // DATA - ONLINE FETCH
                .then(response => {
                    const idb = new Database();
                    const responseClone = response.clone();
                    responseClone.json()
                        .then(data => {
                            idb.connect(DB_NAME)
                                .then(db => db.update('temperatures', data))
                        })
                    return response;
                })
                .catch(error => {                                                   // DATA - OFFLINE IDB
                    console.log('DATA fetch error', error);
                    const idb = new Database();
                    if (event.request.method === 'GET') {
                        return idb.connect(DB_NAME)
                            .then(db => db.read('temperatures'))
                            .then(data => {
                                console.log('DATA fetch error', data[0]);
                                return new Response(JSON.stringify(data[0]))
                            });
                    }

                    if (event.request.method === 'POST') {
                        return idb.connect(DB_NAME)
                            .then(db => db.read('temperatures'))
                            .then(data => {
                                const d = data[0];
                                event.request.json()
                                    .then(jsonData => {
                                        d.data.push(jsonData.unit);
                                        console.log('DATA fetch error in POST', d);
                                        idb.connect(DB_NAME)
                                            .then(db => db.update('temperatures', d))
                                            .then(() => new Response(JSON.stringify(d)))
                                        return new Response(JSON.stringify(d))
                                    });
                                return new Response(JSON.stringify(d))
                            });
                    }

                })
        );
    } else {
        console.log('ASSET PART from online : ', event.request.url);
        event.respondWith(
            caches.match(event.request)
                .then(response => {
                    if (response) {
                        return response;
                    } else {

                        return fetch(event.request)
                            .then(response => {
                                caches.open(DYNAMIC_CACHE_NAME)
                                    .then(cache => {
                                        cache.put(event.request.url, response.clone());
                                        return response.clone();
                                    })
                                    .then(() => response.clone())
                                return response.clone();
                            })
                            .catch(error => {
                                console.log('ASSET error ', error);
                            })
                    }
                })
        )
    }
});

self.addEventListener('notificationclick', function (event) {
    const {notification, action} = event;
    if (action === 'confirm') {
        console.log('Confirm was clicked');
        notification.close();
    } else {
        console.log(action);
    }
});

self.addEventListener('sync', function (event) {
    console.log('SYNC');
});
