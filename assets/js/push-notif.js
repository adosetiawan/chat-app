// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
window.addEventListener('load', function () {
    navigator.serviceWorker.register('firebase-messaging-sw.js').then(function (registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function (err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
    });
});
}

messaging.requestPermission()
.then(function () {
    return messaging.getToken()
}).then(function (token) {
    console.log(token);
}).catch(function (err) {
   // console.log("Unable to get permission to notify.", err);
});
messaging.onMessage(function(messages){
console.log(messages);
});

