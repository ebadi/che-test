const cacheName = "cache1"; // Change value to force update

self.addEventListener("install", event => {
	// Kick out the old service worker
	self.skipWaiting();

	event.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll([
				"/",
				"static/logo.png", // Favicon, Android Chrome M39+ with 0.75 screen density
				"static/logo48x48.png", // Favicon, Android Chrome M39+ with 1.0 screen density
				"static/logo72x72.png", // Favicon, Android Chrome M39+ with 1.5 screen density
				"static/logo96x96.png", // Favicon, Android Chrome M39+ with 2.0 screen density
				"static/logo144x144.png", // Favicon, Android Chrome M39+ with 3.0 screen density
				"static/logo192x192.png", // Favicon, Android Chrome M39+ with 4.0 screen density
				"static/logo256x256.png", // Favicon, Android Chrome M47+ Splash screen with 1.5 screen density
				"static/logo384x384.png", // Favicon, Android Chrome M47+ Splash screen with 3.0 screen density
				"static/logo512x512.png", // Favicon, Android Chrome M47+ Splash screen with 4.0 screen density
				"static/logo.png", // Favicon, Apple default
				"static/logo57x57.png", // Apple iPhone, Non-retina with iOS6 or prior
				"static/logo60x60.png", // Apple iPhone, Non-retina with iOS7
				"static/logo72x72.png", // Apple iPad, Non-retina with iOS6 or prior
				"static/logo76x76.png", // Apple iPad, Non-retina with iOS7
				"static/logo114x114.png", // Apple iPhone, Retina with iOS6 or prior
				"static/logo120x120.png", // Apple iPhone, Retina with iOS7
				"static/logo152x152.png", // Apple iPad, Retina with iOS7
				"static/logo180x180.png", // Apple iPhone 6 Plus with iOS8
				"browserconfig.xml", // IE11 icon configuration file
				"favicon.ico", // Favicon, IE and fallback for other browsers
				"static/logo16x16.png", // Favicon, default
				"static/logo32x32.png", // Favicon, Safari on Mac OS
				"index.html", // Main HTML file
				"logo.png", // Logo
				"main.js", // Main Javascript file
				"manifest.json", // Manifest file
				"static/logo70x70.png", // Favicon, Windows 8 / IE11
				"static/logo144x144.png", // Favicon, Windows 8 / IE10
				"static/logo.svg", // Favicon, Safari pinned tab
			]);
		})
	);
});

self.addEventListener("activate", event => {
	// Delete any non-current cache
	event.waitUntil(
		caches.keys().then(keys => {
			Promise.all(
				keys.map(key => {
					if (![cacheName].includes(key)) {
						return caches.delete(key);
					}
				})
			)
		})
	);
});

// Offline-first, cache-first strategy
// Kick off two asynchronous requests, one to the cache and one to the network
// If there's a cached version available, use it, but fetch an update for next time.
// Gets data on screen as quickly as possible, then updates once the network has returned the latest data. 
self.addEventListener("fetch", event => {
	event.respondWith(
		caches.open(cacheName).then(cache => {
			return cache.match(event.request).then(response => {
				return response || fetch(event.request).then(networkResponse => {
					cache.put(event.request, networkResponse.clone());
					return networkResponse;
				});
			})
		})
	);
});