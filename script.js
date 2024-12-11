let notificationInterval;

const cardsContainer = document.getElementById('cards-container');

// Example cards
const cards = [
  { title: "Live Better", text: "Available Balance", image: "img_liveBetter_logo.svg", id: "" },
  { title: "Capitec Connect", text: "Connecting you for less", image: "img_capitecConnect_logo.png", id: "" },
  { title: "Always There For you", text: "Near by deals", image: "img_prox_logo.png", id: "proximityMenuButton" },
  { title: "Easy Equities", text: "Investing made easy", image: "img_easyEquities_logo.png", id: "" }
];

// Render cards dynamically
cards.forEach(card => {
  const cardDiv = document.createElement('div');
  cardDiv.id = card.id;
  cardDiv.className = 'card';
  cardDiv.innerHTML = `
    <img src="${card.image}" alt="${card.title}">
    <div>
      <h3>${card.title}</h3>
      <p>${card.text}</p>
    </div>
  `;
  cardsContainer.appendChild(cardDiv);
});

// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker registered'))
    .catch(err => console.error('Service Worker registration failed:', err));
}

// ----------------------------------------------



// Toggle functionality
const toggle = document.getElementById('opt-in-toggle');
const toggleStatus = document.getElementById('toggle-status');

toggle.addEventListener('change', () => {

  localStorage.setItem('optInToggle', toggle.checked); // Save state

  toggleStatus.textContent = toggle.checked ? 'You have Opted-In' : 'You have not Opted-In';
  toggle.checked ? cardsContainerBiz.classList.remove('hidden') : cardsContainerBiz.classList.add('hidden');
  toggle.checked ? titleBiz.classList.remove('hidden') : titleBiz.classList.add('hidden');

  toggle.checked ? spacer1.classList.add('hidden') : spacer1.classList.remove('hidden');
});

// Slider functionality
const slider = document.getElementById('frequency-slider');
const sliderValue = document.getElementById('slider-value');

// Register the Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {
    console.log('[PWA] Service Worker registered.');

    // Load the saved frequency from localStorage
    const storedFrequency = localStorage.getItem('frequencyValue') || 30; // Default to 30 mins
    slider.value = storedFrequency; // Set the slider to the saved value
    updateSliderDisplay(storedFrequency); // Update the display text
    sendFrequencyToServiceWorker(storedFrequency); // Send the frequency to the Service Worker

    // Update frequency when the slider value changes
    slider.addEventListener('input', () => {
      const newFrequency = slider.value;
      localStorage.setItem('frequencyValue', newFrequency); // Save the value to localStorage
      updateSliderDisplay(newFrequency); // Update the display text
      sendFrequencyToServiceWorker(newFrequency); // Send the updated frequency to the Service Worker
    });
  }).catch(err => console.error('[PWA] Service Worker registration failed:', err));
}

// Function to update the slider display
function updateSliderDisplay(frequency) {
  const time = frequency < 60 ? `${frequency} mins` : `${Math.floor(frequency / 60)} hours`;
  sliderValue.textContent = time;
}

// Function to send frequency to the Service Worker
function sendFrequencyToServiceWorker(frequency) {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SET_FREQUENCY',
      value: frequency,
    });
    console.log(`[PWA] Frequency set to ${frequency} minutes`);
  }
}

document.addEventListener('DOMContentLoaded', () => {

  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        alert('Notifications are disabled. Please enable them for this feature.');
      }
    });
  }

  const savedToggle = localStorage.getItem('optInToggle');
  // const savedFrequency = localStorage.getItem('frequencyValue');

  if (savedToggle !== null) {

    toggle.checked = savedToggle === 'true';
    toggleStatus.textContent = toggle.checked ? 'You have Opted-In' : 'You have not Opted-In';
    toggle.checked ? cardsContainerBiz.classList.remove('hidden') : cardsContainerBiz.classList.add('hidden');
    toggle.checked ? titleBiz.classList.remove('hidden') : titleBiz.classList.add('hidden');

    toggle.checked ? spacer1.classList.add('hidden') : spacer1.classList.remove('hidden');
  }

  // if (savedFrequency !== null) {

  //   slider.value = savedFrequency;
  //   const time = savedFrequency < 60 ? `${savedFrequency} mins` : `${Math.floor(savedFrequency / 60)} hours`;
  //   sliderValue.textContent = time;
  // }
});

// Cards Section
const cardsContainerBiz = document.getElementById('cards-container-biz');
const cardsBiz = [
  { title: "The Coffee Bar", text: "1 free coffee", image: "img_businessShop.png", id:"coffee" },
  { title: "Abuzz Wine", text: "Buy 6 get 10% off", image: "https://via.placeholder.com/50", id:"" },
  { title: "Aleph Biltong", text: "Buy 2 get 1 free", image: "https://via.placeholder.com/50", id:"" },
  { title: "Bellezza Skincare Clinic", text: "20% discount", image: "https://via.placeholder.com/50", id:"" },
  { title: "Base Fit", text: "First-time visit free", image: "https://via.placeholder.com/50", id:"" },
  { title: "Cornerstone Cafe", text: "15% off first order", image: "https://via.placeholder.com/50", id:"" },
  { title: "Eikestad Dental", text: "R500 off first teeth whitening", image: "https://via.placeholder.com/50", id:"" },
  { title: "Lizal's Food Truck ", text: "10% off lunch specials", image: "https://via.placeholder.com/50", id:"" },
  { title: "Lizzy at Technohair", text: "20% off highlights", image: "https://via.placeholder.com/50", id:"" },
  { title: "Mugg and Bean", text: "R50 off order", image: "https://via.placeholder.com/50", id:"" }
];

// Function to render a card
function renderCard(card) {
  const cardDiv = document.createElement('div');
  cardDiv.className = 'card';
  cardDiv.id = card.id;
  cardDiv.innerHTML = `
    <img src="img_businessShop.png" alt="${card.title}">
    <div>
      <h3>${card.title}</h3>
      <p>${card.text}</p>
    </div>
  `;
  cardsContainerBiz.appendChild(cardDiv);
}

// Select the first card and render it
renderCard(cardsBiz[0]);

// Select 4 random cards from the remaining ones
const remainingCards = cardsBiz.slice(1);
const randomCards = [];
while (randomCards.length < 4) {
  const randomIndex = Math.floor(Math.random() * remainingCards.length);
  const selectedCard = remainingCards.splice(randomIndex, 1)[0]; // Remove and select a random card
  randomCards.push(selectedCard);
}

// Render the 4 random cards
randomCards.forEach(card => renderCard(card));

const homePage = document.getElementById('homePage');
const proximityPage = document.getElementById('proximityPage');
const voucherPage = document.getElementById('voucherPage');

const proximityMenuButton = document.getElementById('proximityMenuButton');
const homeButton = document.getElementById('homeButton');

const coffeeCard = document.getElementById('coffee');

const spacer1 = document.getElementById('spacer1');
const titleBiz = document.getElementById('titleBiz');

const hideAllPages = () => {

  homePage.classList.add('hidden');
  proximityPage.classList.add('hidden');
  voucherPage.classList.add('hidden');
}

proximityMenuButton.addEventListener('click', async () => {

  hideAllPages();
  proximityPage.classList.remove('hidden');
});

homeButton.addEventListener('click', async () => {

  hideAllPages();
  homePage.classList.remove('hidden');
});

coffeeCard.addEventListener('click', async () => {

  hideAllPages();
  voucherPage.classList.remove('hidden');
});



// ---------------------------------------------- Installing PWA
let deferredPrompt;

// Listen for the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;

  // Show the custom install banner
  const installBanner = document.getElementById('install-banner');
  installBanner.style.display = 'flex'; // Show the banner

  // Handle the "Install Now" button click
  const installButton = document.getElementById('install-prompt-btn');
  installButton.addEventListener('click', () => {
    deferredPrompt.prompt(); // Show the browser's install prompt
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      deferredPrompt = null; // Clear the saved event
    });

    // Hide the custom banner
    installBanner.style.display = 'none';
  });

  // Handle the "Dismiss" button click
  const dismissButton = document.getElementById('dismiss-banner-btn');
  dismissButton.addEventListener('click', () => {
    installBanner.style.display = 'none'; // Hide the banner
  });
});
