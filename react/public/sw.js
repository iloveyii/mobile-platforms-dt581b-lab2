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

function get_data(event) {
    return new Promise(function (resolve, reject) {
        let verb = '';
        const idb = new Database();
        let request_data, response_data;

        switch (event.request.method) {
            case 'GET':
                verb = (event.request.url.split('/')).pop();
                fetch(event.request.url)
                    .then(response => response.json())
                    .then(data => response_data = data)
                    .then(() => idb.connect(DB_NAME))
                    .then(db => db.update(verb, response_data))
                    .then(() => resolve(new Response(JSON.stringify(response_data))))
                    .catch(error => {
                        console.log('GET Error ', error);
                        idb.connect(DB_NAME)
                            .then(db => db.read(verb))
                            .then(data => {
                                if (data && data[0]) {
                                    resolve(new Response(JSON.stringify(data[0])))
                                } else {
                                    resolve(new Response(JSON.stringify({success: false})))
                                }
                            })
                    });
                break;
            case 'POST':
                verb = (event.request.url.split('/')).pop();

                event.request.json()
                    .then(data => request_data = data)
                    .then(() =>
                        fetch(event.request.url, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(request_data)
                        })
                    )
                    .then(response => response.json())
                    .then(data => response_data = data)
                    .then(() => resolve(data))
                    .catch(error => {
                        console.log('POST ERR ', error);
                        idb.connect(DB_NAME)
                            .then(db => db.add_to_store_data(verb + '_sync', request_data))
                    });


                break;
            case 'PUT':
                break;
            case 'DELETE':
                break;
        }
    })
}

self.addEventListener('fetch', function (event) {
    if (event.request.url.includes('api/v1')) {
        event.respondWith(get_data(event));
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
    console.log('SYNC Started');
    const idb = new Database();
    idb.connect(DB_NAME)
        .then(db => db.read('temperatures_sync'))
        .then(data => {
            console.log(data[0]);
            if (!data || data[0]) return false;
            return fetch('http://localhost:5000/api/v1/temperatures', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: data && data[0] ? JSON.stringify(data[0].data) : ''
            })
                .then(response => console.log(response))
        });
});
