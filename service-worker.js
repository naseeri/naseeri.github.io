const CACHE_NAME = 'capitec-pwa-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icon.png',
  'img_businessShop.png',
  '/img_capitecConnect_logo.png',
  '/img_easyEquities_logo.png',
  '/img_footerMenu_home.png',
  '/img_liveBetter_logo.svg',
  '/img_mapDirections.png',
  '/img_prox_logo.png',
  '/img_proxi_ladyWithPhone.png',
  '/img_qrCode_voucher.png'
];

let notificationFrequency = 30 * 60 * 1000; // Default frequency (30 minutes in milliseconds)
let notificationInterval;

// Install event (Cache resources)
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // Activate the Service Worker immediately
});

// Activate event
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activated.');
});

// Fetch event (Serve cached resources)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Push event (Handle incoming push notifications)
self.addEventListener('push', event => {
  console.log('[Service Worker] Push Received.');

  const title = 'Capitec Deals';
  const options = {
    body: 'There are deals around you. Get 1 coffee free!',
    icon: 'icon.png', // Ensure the icon is cached
    badge: 'icon.png', // Smaller badge for the notification
    data: {
      url: '/', // The URL to open when the notification is clicked
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click event (Handle redirection)
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Notification Clicked.');
  event.notification.close(); // Close the notification

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Focus the tab if already open
      for (let client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Open a new tab if none are found
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Listen for messages from the main script to set notification frequency
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SET_FREQUENCY') {
    notificationFrequency = event.data.value * 60 * 1000; // Convert minutes to milliseconds
    console.log(`[Service Worker] Notification frequency set to ${notificationFrequency}ms`);
    startNotificationSchedule();
  }
});

// Function to start the notification schedule
function startNotificationSchedule() {
  if (notificationInterval) {
    clearInterval(notificationInterval);
  }

  notificationInterval = setInterval(() => {
    // Only send notification if today's date is 11th or 12th December 2024
    const today = new Date();
    const targetDates = [
      new Date('2024-12-11').toDateString(), // 11th December 2024
      new Date('2024-12-12').toDateString()  // 12th December 2024
    ];

    if (targetDates.includes(today.toDateString())) {
      sendNotification();
    } else {
      console.log('[Service Worker] Notification not sent. Today is not within the allowed dates.');
    }
  }, notificationFrequency);
}

// Function to send a notification
function sendNotification() {
  const title = 'Capitec Deals';
  const options = {
    body: 'There are deals around you. Get 1 coffee free!',
    icon: 'icon.png', // Ensure the icon is cached
    badge: 'icon.png', // Replace with a smaller badge icon if needed
    data: {
      url: '/', // Redirect URL when the notification is clicked
    },
  };

  self.registration.showNotification(title, options);
}
