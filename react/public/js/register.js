async function setCurrentVersion() {
    console.log('Service worker fetch version')
    const response = await fetch('/version.json');
    const data = await response.json();
    localStorage.setItem('sw_version', data.version);
    await clearOldCaches(data.version);
}

// Remove all older than version, To delete set version > 1 in version.json
async function clearOldCaches(version) {
    const keys = await caches.keys();
    keys.map(async (k) => {
        if (!k.includes('-v' + version)) {
            console.log('Service worker deleting version', k);
            await caches.delete(k);
        }
    });
}

if (true && 'serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw2.js')
        .then(async function (event) {
            // console.log('Service worker registered sw2', event.scope);
            await setCurrentVersion();
        }).catch(function (error) {
        console.log('Error in SW : ', error);
    });

    // Then later, request a one-off sync:
    navigator.serviceWorker.ready.then(function(swRegistration) {
        return swRegistration.sync.register('myFirstSync');
    });
}
