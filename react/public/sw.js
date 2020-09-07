const STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',

    '/images/no-image.png'
];
const STATIC_CACHE_NAME = 'static-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';
const DB_NAME = 'receipts';

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

self.addEventListener('fetch', async function (event) {
    // console.log('ASSET PART', event.request.url);
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                // CATCHE
                if (response) {
                    // console.log('ASSET PART from cache');
                    return response;
                } else {
                    // ONLINE
                    return fetch(event.request)
                        .then(function (response) {
                            return caches.open(DYNAMIC_CACHE_NAME)
                                .then(async function (cache) {
                                    if (!event.request.url.includes('api/v1' || !event.request.url.includes('backup/receipt'))) {
                                        await cache.put(event.request.url, response.clone());
                                        console.log('ASSET PART from online');
                                    }
                                    return response;
                                })
                            // OFFLINE
                        }).catch(function (error) {
                            // console.log('Service worker fetch error ', event.request.url);
                            // console.log('ASSET PART from proxy');
                            // Proxy
                            if (event.request.url.includes('.html')) {
                                console.log('HTML')
                            }

                            if (event.request.url.includes('index') || event.request.url.includes('.html')) {
                                console.log('INDEX');
                                return caches.match('/offline.html')
                            }

                            if (event.request.url.includes('.png')) {
                                console.log('PNG')
                                return caches.match('/images/no-image.png')
                            }
                        })
                }
            })
    );
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
