importScripts('/js/idb.js');


const STATIC_FILES = [
    '/',                                    // HTML
    '/index.html',
    '/offline.html',
    '/manifest.json',
    '/version.json',

    '/images/favicon-32x32.png',            // PNG
    '/images/android-chrome-192x192.png',
    '/images/no-image.png',

    '/js/idb.js',                           // JS
    '/js/register.js',
    '/js/bundle.js',
    '/js/0.bundle.js',
    '/js/1.bundle.js'
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

const handlePost = (event, METHOD, VERB) => {
    return new Promise(function (resolve, reject) {
        const idb = new Database();
        let response_data = '', request_data = '';
        return event.request.json()
            .then(data => request_data = data)
            .then(() =>
                fetch(event.request.url, {
                    method: METHOD,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(request_data)
                })
            )
            .then(response => response.json())
            .then(data => response_data = data)
            .then(() => resolve(new Response(JSON.stringify(response_data))))
            .catch(error => {
                console.log('POST ERR ', error);
                idb.connect(DB_NAME)
                    .then(db => {
                        db.add_to_store_data(VERB + '_sync', request_data);
                        db.add_to_store_data(VERB, request_data);
                        return request_data;
                    })
                    .then(data => {
                        console.log('Returning response from failed POST ', data);
                        resolve(new Response(JSON.stringify({success: true, data: [data.form]})))
                    })
            });
    })
};

const handleDelete = (event, VERB, id) => {
    return new Promise(function (resolve, reject) {
        const idb = new Database();

        return fetch(event.request.url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then((data) => resolve(data))
            .catch(error => {
                console.log('DELETE ERR ', error);
                idb.connect(DB_NAME)
                    .then(db => {
                        const request_data = {form: {id, method: 'DELETE'}};
                        db.remove_from_store_data(VERB + '_sync', request_data);
                        db.remove_from_store_data(VERB, request_data);
                        return request_data;
                    })
                    .then(data => {
                        console.log('Returning response from failed POST ', data);
                        resolve(new Response(JSON.stringify({success: true, data})))
                    })
            });
    })
};

const handleRead = (event, VERB, id) => {
    return new Promise(function (resolve, reject) {
        const idb = new Database();
        let response_data;
        return fetch(event.request.url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then((data) => {
                response_data = data;
                console.log('read then ', response_data);
                resolve(new Response(JSON.stringify(data)))
            })
            .then(() => idb.connect(DB_NAME))
            .then(db => db.update(VERB, response_data))
            .catch(error => {
                console.log('READ ERR ', error);
                idb.connect(DB_NAME)
                    .then(db => db.read(VERB))
                    .then(data => {
                        console.log('Returning response from failed GET ', data);
                        resolve(new Response(JSON.stringify(data)))
                    })
            });
    })
};

self.addEventListener('fetch', function (event) {
    const URL = event.request.url;
    const URL_ARR = (event.request.url.split('/'));
    const METHOD = event.request.method;
    let VERB = '';
    // console.log('dataFETCH ' + URL);
    if (URL.includes('api/v1')) {                                      // DATA
        switch (METHOD) {
            case 'POST':
                VERB = URL_ARR.pop();
                return event.respondWith(handlePost(event, METHOD, VERB));          // event, method, verb
            case 'PUT':
                VERB = URL_ARR.pop();
                VERB = URL_ARR.pop();
                return event.respondWith(handlePost(event, METHOD, VERB));          // event, method, verb
            case 'DELETE':
                const id = URL_ARR.pop();
                console.log('Deleting unit with id ', id);
                VERB = URL_ARR.pop();
                return event.respondWith(handleDelete(event, VERB, id));          // event, method, verb
            case 'GET':
                VERB = URL_ARR.pop();
                return event.respondWith(handleRead(event, VERB, null));          // event, method, verb
        }
    } else {                                                                                // ASSETS
        // console.log('ASSET PART from online : ', event.request.url);
        event.respondWith(
            caches.match(event.request.url)
                .then(response => {
                    if (response) {
                        return response;
                    } else {
                        // console.log('Error in asset fetch ', event.request.url);
                        return new Response('no data')
                    }
                })
        );
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
            console.log('SYNC ', data); // {success: true, data: []}
            if (data && data.success && data.success === true) {
                data.data.map(unit => {
                    let id = '';
                    const METHOD = unit.method;
                    if (['PUT', 'DELETE'].includes(METHOD)) {
                        id = '/' + unit.id;
                    }
                    return fetch('http://localhost:5000/api/v1/temperatures' + id, {
                        method: METHOD,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({form: unit})
                    })
                        .then(response => console.log(response))
                });

                Promise.all(data.data).then(() => {
                    console.log('Resolved all');
                })
            }
        })
        .then(() => idb.connect(DB_NAME))
        .then(db => db.update('temperatures_sync', {success: true, data: []}))
});
