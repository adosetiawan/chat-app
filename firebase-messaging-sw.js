importScripts("https://www.gstatic.com/firebasejs/8.1.2/firebase-app.js",);
importScripts("https://www.gstatic.com/firebasejs/7.16.1/firebase-messaging.js",);
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts("https://www.gstatic.com/firebasejs/8.1.2/firebase-analytics.js",);

//Initialize the Firebase app in the service worker by passing in the
firebase.initializeApp({
    messagingSenderId: "958653917371",
    apiKey: "AIzaSyAhSRiiRoIUIxEzW-CPCWb8HXVjZvYkyCg",
    projectId: "real-chatting-5e17e",
    appId: "1:958653917371:web:5c61076a71c3e159c4e19e",

});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload,
    );
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        icon: "/itwonders-web-logo.png",
    };

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions,
    );
});

var CACHE_NAME = "realtimechat_cache_v1";

urlsToCache = [
    '/firebase/',
    '/firebase/assets/css/icons.min.css',
    '/firebase/assets/css/app-creative.min.css',
    '/firebase/assets/css/app-creative-dark.min.css',
    '/firebase/assets/js/app.min.js',
    '/firebase/assets/js/push-notif.js',
    '/firebase/assets/js/document.js',
    '/firebase/assets/js/auth.js',
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('install service worker in Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });

self.addEventListener('activate',function(event){
    event.waitUntil(
        caches.keys().then(function(cachesNames){
            return Promise.all(
                cachesNames.filter(function(cacheName){
                    return cacheName != CACHE_NAME;
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            )
        })
    );
});


self.addEventListener('fetch', function (event) {

    let request = event.request;
    //console.log(request);
    let url = new URL(request.url)
  
  
    if (url.origin === location.origin) {
  
      event.respondWith(
        caches.match(request).then(function (response) {
          return response || fetch(request);
        })
      );
  
    } else {
      event.respondWith(
        caches.open('product-cache').then(function (cache) {
          return fetch(request).then(function (liveResponse) {
            cache.put(request, liveResponse.clone())
            return liveResponse;
          }).catch(function () {
            return caches.match(request).then(function (response) {
              if (response) return response
              return caches.match('/fallback.json')
            })
          })
        })
      )
    }
  
    //pisahkan request api dan internal
  
  });