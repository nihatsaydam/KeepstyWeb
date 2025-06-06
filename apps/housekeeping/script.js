// ============================
// Global Değişkenler
// ============================
let menuData = {};      // Menü verileri (JSON üzerinden yüklenecek)
let cart = [];          // Sepet dizisi
let botFlow = {};       // Bot akış verileri (opsiyonel)
let currentNode = "start";
let currentLanguage = localStorage.getItem("currentLanguage") || "en"; // Eğer daha önce seçtiyse, onu al; yoksa İngilizce yap
let selectedCategory = "";
let selectedIssue = "";
let chatHistory = [];

// ============================
// Dil Seçimi ve Hoş Geldiniz Popup'ı
// ============================
function loadLanguageSelection() {
  const languageDiv = document.getElementById("languages");
  const languages = [
    { code: "en", name: "English", icon: "assets/images/english.png" },
    { code: "tr", name: "Türkçe", icon: "assets/images/turkish.png" },
    { code: "fr", name: "Français", icon: "assets/images/french.png" },
    { code: "ar", name: "العربية", icon: "assets/images/arabic.png" }
  ];

  languages.forEach(lang => {
    const button = document.createElement("button");
    button.className = "language-option";
    button.innerHTML = `<img src="${lang.icon}" alt="${lang.name}"><span>${lang.name}</span>`;
    button.onclick = () => selectLanguage(lang.code);
    languageDiv.appendChild(button);
  });
}

function selectLanguage(langCode) {
  localStorage.setItem("currentLanguage", langCode);
  currentLanguage = langCode;
  location.reload();
}

function showWelcomePopup() {
  const messages = {
    en: `
      Welcome to Keepsty Housekeeping! I'm here to make your stay as comfortable and seamless as possible.
      Whether you need fresh towels, room cleaning, or any other housekeeping services, I'm just a message away.
    `,
    tr: `
      Keepsty Housekeeping'e hoş geldiniz! Konaklamanızı mümkün olduğunca konforlu ve sorunsuz hale getirmek için buradayım.
      Taze havlular, oda temizliği veya diğer hizmetlere ihtiyacınız olursa, yalnızca bir mesaj uzağınızdayım.
    `,
    fr: `
      Bienvenue à Keepsty Housekeeping ! Je suis ici pour rendre votre séjour aussi confortable et fluide que possible.
    `,
    ar: `
      مرحبًا بكم في Keepsty Housekeeping! أنا هنا لجعل إقامتكم مريحة وسلسة قدر الإمكان.
    `
  };

  const message = messages[currentLanguage] || messages.en;
  const popup = document.createElement("div");
  popup.id = "welcome-popup";
  popup.innerHTML = `
    <div class="popup-content">
      <p>${message}</p>
      <div class="popup-buttons">
        <button id="popup-yes">Continue</button>
        <button id="popup-no">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  document.getElementById("popup-yes").onclick = () => {
    document.body.removeChild(popup);
    document.getElementById("app").style.display = "block"; // Menü ekranını göster
  };

  document.getElementById("popup-no").onclick = () => {
    document.body.removeChild(popup);
    alert("Thank you!");
  };
}

// ============================
// Temizlik Pop-up İşlemleri (Opsiyonel)
// ============================
function showTimePopup() {
  // Preload the logo image when popup opens
  const preloadImage = new Image();
  preloadImage.src = "assets/images/keepsty-logo.png";
  
  document.getElementById("time-popup").style.display = "flex";
}
function hideTimePopup() {
  document.getElementById("time-popup").style.display = "none";
}
function setQuickOption(minutes) {
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + minutes);
  const hours = currentDate.getHours();
  const minutesPadded = String(currentDate.getMinutes()).padStart(2, "0");
  const selectedTime = `${hours}:${minutesPadded}`;
  alert(`Selected Time: ${selectedTime}`);
}

let selectedCleanOption = "";
function selectCleanOption(optionName) {
  selectedCleanOption = optionName;
  console.log("✅ Güncellenen Temizlik Seçeneği:", selectedCleanOption);
  
  // Tüm butonlardan selected class'ını kaldır
  const buttons = document.querySelectorAll("#clean-options button");
  buttons.forEach(btn => {
    btn.classList.remove("selected");
  });
  
  // Seçilen butonun data-option değerine göre bul ve selected class'ı ekle
  const dataOption = optionName.toLowerCase().replace(' ', '');
  const selectedButton = document.querySelector(`button[data-option="${dataOption}"]`);
  if (selectedButton) {
    selectedButton.classList.add("selected");
    console.log("Button selected:", selectedButton.id);
  } else {
    console.error("Could not find button with data-option:", dataOption);
  }
}

document.getElementById("cancel-time") && (document.getElementById("cancel-time").onclick = hideTimePopup);
document.addEventListener("DOMContentLoaded", () => {
  const timeOptionsOutside = document.querySelectorAll(".quick-options-outside");
  timeOptionsOutside.forEach(option => (option.style.display = "none"));
});

// ============================
// Menü ve Kategori İşlemleri
// ============================
function showItemList() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('item-list-section').style.display = 'block';
  let currentLanguage = localStorage.getItem("currentLanguage") || "en";
  console.log(`🌍 Yüklenen Menü Dili: ${currentLanguage}`);
  fetch(`data/menu-${currentLanguage}.json`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`JSON dosyası yüklenemedi: data/menu-${currentLanguage}.json`);
      }
      return response.json();
    })
    .then(data => {
      console.log("✅ Yüklenen Menü JSON:", data);
      const itemListDiv = document.getElementById('item-list');
      itemListDiv.innerHTML = '';
      data.menu.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('dynamic-menu-option');
        const categoryImage = document.createElement('img');
        categoryImage.src = category.image;
        categoryImage.alt = category.name;
        categoryCard.appendChild(categoryImage);
        const optionDetails = document.createElement('div');
        optionDetails.classList.add('option-details');
        const title = document.createElement('h3');
        title.textContent = category.name;
        optionDetails.appendChild(title);
        const desc = document.createElement('p');
        desc.textContent = category.description;
        optionDetails.appendChild(desc);
        const button = document.createElement('button');
        button.textContent = 'Choose';
        button.addEventListener('click', () => {
          showCategoryItems(category);
        });
        optionDetails.appendChild(button);
        categoryCard.appendChild(optionDetails);
        itemListDiv.appendChild(categoryCard);
      });
    })
    .catch(error => {
      console.error('⚠ Menü yüklenirken hata oluştu:', error);
    });
}

function showCategoryItems(category) {
  const itemListDiv = document.getElementById('item-list');
  itemListDiv.innerHTML = ''; // Önceki içeriği temizle
  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('items-container');
  category.items.forEach(item => {
    item.quantity = item.quantity || 0;
    const itemCard = document.createElement('div');
    itemCard.classList.add('item-card');
    const itemName = document.createElement('h4');
    itemName.textContent = item.name;
    itemCard.appendChild(itemName);
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-container');
    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '–';
    decreaseButton.addEventListener('click', () => {
      if (item.quantity > 0) {
        item.quantity--;
        quantityDisplay.textContent = item.quantity;
        removeFromCart(item);
      }
    });
    const quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = item.quantity;
    quantityDisplay.classList.add('quantity-display');
    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.addEventListener('click', () => {
      item.quantity++;
      quantityDisplay.textContent = item.quantity;
      addToCart(item);
    });
    quantityContainer.appendChild(decreaseButton);
    quantityContainer.appendChild(quantityDisplay);
    quantityContainer.appendChild(increaseButton);
    itemCard.appendChild(quantityContainer);
    itemsContainer.appendChild(itemCard);
  });
  itemListDiv.appendChild(itemsContainer);
}

function goBack() {
  document.getElementById('item-list-section').style.display = 'none';
  document.getElementById('menu').style.display = 'block';
}

// ============================
// Sepet İşlevleri
// ============================

// Sepete ekleme
function addToCart(item) {
  console.log("addToCart called with:", item);
  let existingItem = cart.find(cartItem => cartItem.id === item.id || cartItem.name === item.name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
  updateCartDisplay();
}

// Sepetten çıkarma
function removeFromCart(item) {
  let existingItem = cart.find(cartItem => cartItem.id === item.id || cartItem.name === item.name);
  if (existingItem) {
    existingItem.quantity--;
    if (existingItem.quantity <= 0) {
      cart = cart.filter(cartItem => cartItem.id !== item.id);
    }
  }
  updateCartDisplay();
}

// Sepeti güncelleme ekranı
function updateCartDisplay() {
  let total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = `Cart (${total})`;
  }
  console.log("Cart updated:", cart);
}

// Sepet verilerini sunucuya kaydeden fonksiyon (MongoDB'ye POST)
async function saveCartData() {
  const username = localStorage.getItem("username") || "defaultUsername";
  const roomNumber = localStorage.getItem("roomNumber") || "defaultRoomNumber";
  try {
    const response = await fetch('https://keepstyback.onrender.com/save-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        roomNumber: roomNumber,
        cartItems: cart
      })
    });
    if (!response.ok) {
      throw new Error('Failed to save cart data.');
    }
    const result = await response.json();
    console.log("✅ Cart data saved to MongoDB:", result);
    return result;
  } catch (error) {
    console.error("❌ Error saving cart data:", error);
    throw error;
  }
}

// Sepet ekranını gösteren fonksiyon
function showCartScreen() {
  const cartScreen = document.getElementById('cart-screen');
  cartScreen.style.display = 'flex';
  cartScreen.innerHTML = '';  // Önceki içerikleri temizle

  // Üst kısım: Başlık ve Kapatma Butonu
  const header = document.createElement('div');
  header.className = 'cart-header';
  const title = document.createElement('h2');
  title.textContent = 'Your Care Basket';
  header.appendChild(title);
  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = 'X';
  closeButton.addEventListener('click', hideCartScreen);
  header.appendChild(closeButton);
  cartScreen.appendChild(header);

  // Orta kısım: Sepet ürünlerini listeleyecek alan
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'cart-items-container';
  if (cart.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Cart is currently empty.';
    itemsContainer.appendChild(emptyMessage);
  } else {
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      itemDiv.innerHTML = `<p>${item.name} (x${item.quantity})</p>`;
      itemsContainer.appendChild(itemDiv);
    });
  }
  cartScreen.appendChild(itemsContainer);

  // "Request" butonu: Sepet verilerini kaydet ve ekranı kapat
  const requestButton = document.createElement('button');
  requestButton.id = 'request-btn';
  requestButton.textContent = 'Request';
  requestButton.addEventListener('click', async () => {
    console.log("🟢 Request button clicked!");
    try {
      const saveResult = await saveCartData();
      console.log("✅ Sepet başarıyla kaydedildi:", saveResult);
      showConfirmationPopup();
      cart = [];
      updateCartDisplay();
      hideCartScreen();
    } catch (error) {
      console.error("❌ Sepet kaydedilemedi:", error);
      alert("Failed to save cart data, please try again later.");
    }
  });
  cartScreen.appendChild(requestButton);
}

function hideCartScreen() {
  const cartScreen = document.getElementById('cart-screen');
  if (cartScreen) {
    cartScreen.style.display = 'none';
  }
}

// ============================
// Confirmation Popup
// ============================
function showConfirmationPopup() {
  document.body.style.backdropFilter = "blur(5px)";
  document.body.style.overflow = "hidden";
  const successPopup = document.createElement('div');
  successPopup.id = 'success-popup';
  successPopup.classList.add('popup-overlay');
  successPopup.style.display = 'flex';
  successPopup.style.alignItems = 'center';
  successPopup.style.justifyContent = 'center';
  successPopup.style.position = 'fixed';
  successPopup.style.top = '0';
  successPopup.style.left = '0';
  successPopup.style.width = '100%';
  successPopup.style.height = '100%';
  successPopup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  successPopup.innerHTML = `
    <div class="popup-content success" style="
      background: white; 
      padding: 20px; 
      border-radius: 15px;
      text-align: center;
      max-width: 350px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    ">
      <img src="assets/images/keepsty-logo.png" alt="Keepsty Logo" class="keepsty-logo" style="width: 120px; height: auto;">
      <h3 class="success-title" style="margin-top: 10px; font-size: 18px;">You are all set!</h3>
    </div>
  `;
  document.body.appendChild(successPopup);
  setTimeout(closeSuccessPopup, 1500);
}

function closeSuccessPopup() {
  const popup = document.getElementById('success-popup');
  if (popup) {
    popup.remove();
  }
  document.body.style.backdropFilter = "none";
  document.body.style.overflow = "auto";
}

// ============================
// Genel Menü Gösterimi
// ============================
function showMainMenu() {
  document.getElementById('item-list-section').style.display = 'none';
  document.getElementById('chatbot').style.display = 'none';
  document.getElementById('cart-screen').style.display = 'none';
  document.getElementById('time-popup').style.display = 'none';
  document.getElementById('menu').style.display = 'block';
  hideCartScreen();
}

// ============================
// DOMContentLoaded: Başlangıç İşlemleri
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // Preload Keepsty logo image to make it load faster
  const preloadImage = new Image();
  preloadImage.src = "assets/images/keepsty-logo.png";
  
  let currentLanguage = localStorage.getItem("currentLanguage") || "en";
  console.log(`🌍 Kullanıcının Seçtiği Dil: ${currentLanguage}`);
  console.log(`📥 Yüklenen JSON Dosyası: data/menu-${currentLanguage}.json`);
  loadMenuData(currentLanguage);
  translatePopupTexts(currentLanguage);
  translateMenuTitles(currentLanguage);

  // Ensures cleaning option buttons work correctly
  const confirmTimeBtn = document.getElementById("confirm-time");
  if (confirmTimeBtn) {
    confirmTimeBtn.addEventListener('click', async () => {
      console.log("Confirm button clicked, selected option:", selectedCleanOption);
      if (!selectedCleanOption) {
        alert("Please select a cleaning option!");
        return;
      }
      
      try {
        const username = localStorage.getItem("username") || "defaultUsername";
        const roomNumber = localStorage.getItem("roomNumber") || "defaultRoomNumber";
        showConfirmationPopup(); // Show confirmation immediately for better UX
        
        const response = await fetch('https://keepstyback.onrender.com/save-cleaning-option', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            roomNumber: roomNumber,
            cleaningOption: selectedCleanOption,
            timestamp: new Date().toISOString()
          })
        });
        
        hideTimePopup();
        const result = await response.json();
        console.log("✅ Data saved:", result);
      } catch (error) {
        console.error("❌ Error saving cleaning option:", error);
        // Still close popup, but log the error
        hideTimePopup();
      }
    });
  }

  // Cart butonuna olay dinleyicisi ekle
  const cartActionItem = document.getElementById('cart-action');
  if (cartActionItem) {
    cartActionItem.addEventListener('click', showCartScreen);
    console.log('Cart action listener eklendi.');
  } else {
    console.error('Cart action öğesi bulunamadı!');
  }
  // Kapatma butonu (varsa) için
  const closeBtn = document.querySelector('.close-btn');
  const cartScreen = document.getElementById('cart-screen');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      cartScreen.style.display = 'none';
    });
  }
});

function loadMenuData(language) {
  fetch(`data/menu-${language}.json`)
    .then(response => response.json())
    .then(data => {
      updateMenuUI(data.menu);
    })
    .catch(error => console.error("Menü verileri yüklenirken hata oluştu:", error));
}

function updateMenuUI(menuItems) {
  const itemListDiv = document.getElementById("item-list");
  itemListDiv.innerHTML = '';
  menuItems.forEach(category => {
    const categoryCard = document.createElement("div");
    categoryCard.classList.add("dynamic-menu-option");
    categoryCard.innerHTML = `
      <img src="${category.image}" alt="${category.name}">
      <div class="option-details">
        <h3>${category.name}</h3>
        <p>${category.description}</p>
        <button onclick="showCategoryItems('${category.key}')">Choose</button>
      </div>
    `;
    itemListDiv.appendChild(categoryCard);
  });
}

function translatePopupTexts(language) {
  fetch(`data/menu-${language}.json`)
    .then(response => response.json())
    .then(data => {
      if (data.popup) {
        document.querySelector("#time-popup h3").textContent = data.popup.cleaningTitle;
        document.querySelector("#clean-options h4").textContent = data.popup.cleaningOptions;
        document.querySelector('button[data-option="room"]').textContent = data.popup.room;
        document.querySelector('button[data-option="bathroom"]').textContent = data.popup.bathroom;
        document.querySelector('button[data-option="wholeroom"]').textContent = data.popup.wholeRoom;
        document.querySelector('button[data-option="refresh"]').textContent = data.popup.refresh;
        document.getElementById("confirm-time").textContent = data.popup.confirm;
        document.getElementById("cancel-time").textContent = data.popup.cancel;
      } else {
        console.error("⚠ Çeviri verisi bulunamadı:", data);
      }
    })
    .catch(error => console.error("⚠ Menü JSON yüklenirken hata oluştu:", error));
}

function translateMenuTitles(language) {
  fetch(`data/menu-${language}.json`)
    .then(response => response.json())
    .then(data => {
      if (data.menuTitles) {
        document.querySelector(".menu-option:nth-child(1) h3").textContent = data.menuTitles.itemListTitle;
        document.querySelector(".menu-option:nth-child(1) p").textContent = data.menuTitles.itemListDescription;
        document.querySelector(".menu-option:nth-child(2) h3").textContent = data.menuTitles.cleaningTitle;
        document.querySelector(".menu-option:nth-child(2) p").textContent = data.menuTitles.cleaningDescription;
      } else {
        console.error("⚠ Menü başlıkları bulunamadı:", data);
      }
    })
    .catch(error => console.error("⚠ Menü başlıkları yüklenirken hata oluştu:", error));
}
