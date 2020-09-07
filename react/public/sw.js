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
        console.log('DATA PART from online : ', event.request.url);
        event.respondWith(
            fetch(event.request.url)                                                        // DATA - ONLINE FETCH
                .then(response => {
                    const idb = new Database();
                    const responseClone = response.clone();
                    responseClone.json()
                        .then(data => {
                            idb.connect(DB_NAME)
                                .then(db => db.create('temperatures', data))
                        })
                    return response;
                })
                .catch(error => {                                                   // DATA - OFFLINE IDB
                    console.log('DATA fetch error');
                    const idb = new Database();
                    idb.connect(DB_NAME)
                        .then(db => db.read('temperatures'))
                        .then(data => console.log(data));
                })
        );
    } else {
        console.log('ASSET PART from online : ', event.request.url);
        event.respondWith(
                fetch(event.request)
                    .then(function (response) {
                        caches.open(DYNAMIC_CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request.url, response.clone());
                                return response.clone();
                            })
                            .then(()=> response.clone())
                        return response.clone();
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
