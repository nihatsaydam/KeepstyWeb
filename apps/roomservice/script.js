// Global Değişkenler
let menuData = {};      // Menü verileri (JSON üzerinden yüklenecek)
let cart = [];          // Sepet dizisi
let botFlow = {};       // Bot akış verileri (opsiyonel)
let currentNode = "start";
let currentLanguage = "en"; // Varsayılan dil
let selectedCategory = "";
let selectedIssue = "";
let chatHistory = [];


document.addEventListener('DOMContentLoaded', () => {
  // Splash screen'i göster, diğer içerikleri gizle
  document.getElementById('splash-screen').style.display = 'flex';
  document.getElementById('menu').style.display = 'none';
  document.getElementById('item-list-section').style.display = 'none';
  document.getElementById('cart-screen').style.display = 'none';
  document.getElementById('chatbot').style.display = 'none';

  // Kabul Et butonu - Room Service'i göster
  document.getElementById('accept-button').addEventListener('click', () => {
    // Splash screen'i gizle
    document.getElementById('splash-screen').style.display = 'none';
    // Menü içeriğini göster
    showItemList();
  });

  // Reddet butonu - Ana sayfaya dön
  document.getElementById('reject-button').addEventListener('click', () => {
    // Ana sayfaya yönlendir
    window.location.href = '../../index.html#card-screen';
  });
});

function showItemList() {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('item-list-section').style.display = 'block';
  showScreen('item-list-section');

  // localStorage'dan dil kodunu al (örneğin, "english", "turkish")
  let currentLanguage = localStorage.getItem('currentLanguage') || 'english'; // Varsayılan İngilizce

    // Dil kodunu dosya adı için uygun hale getir (en, tr, fr, ar)
    const langCodeMap = {
        english: 'en',
        turkish: 'tr',
        french: 'fr',
        arabic: 'ar'
    };
  let langCode = langCodeMap[currentLanguage] || 'en'; // Varsayılan 'en'

  // Doğru JSON dosyasının yolunu oluştur
  const jsonFilePath = `data/menu_${langCode}.json`;


  fetch(jsonFilePath)  // Doğru dosyayı yükle
    .then(response => {
      if (!response.ok) {
        throw new Error(`JSON dosyası yüklenemedi: ${jsonFilePath}`);
      }
      return response.json();
    })
    .then(data => {
      const itemListDiv = document.getElementById('item-list');
      itemListDiv.innerHTML = '';

      data.menu.forEach(category => {
        // ... (Geri kalan kod aynı kalabilir, çünkü JSON yapısı aynı)
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('dynamic-menu-option');

      

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
      console.error('Menu yüklenirken hata oluştu:', error);
      // Burada kullanıcıya hata mesajı gösterebilirsin (opsiyonel)
      alert(`Error loading menu. Please try again later.  Failed to load: ${jsonFilePath}`);
    });
}

function showCategoryItems(category) {
  const itemListDiv = document.getElementById('item-list');
  itemListDiv.innerHTML = '';

  const itemsContainer = document.createElement('div');
  itemsContainer.classList.add('items-container');

  category.items.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.classList.add('item-card');

    const itemName = document.createElement('h4');
    itemName.textContent = item.name;
    itemCard.appendChild(itemName);

    const itemDesc = document.createElement('p');
    itemDesc.textContent = item.description;
    itemCard.appendChild(itemDesc);

    // **Fiyat Bilgisini Ekleyin**
    if (item.price) {
      const itemPrice = document.createElement('p');
      itemPrice.textContent = `Price: ${item.price}`;
      itemPrice.classList.add('item-price');  // CSS için sınıf ekleyin
      itemCard.appendChild(itemPrice);
    }

    const chooseButton = document.createElement('button');
    chooseButton.textContent = 'Choose';
    chooseButton.addEventListener('click', () => {
      addToCart(item);
    });
    itemCard.appendChild(chooseButton);

    itemsContainer.appendChild(itemCard);
  });

  itemListDiv.appendChild(itemsContainer);
}

function goBack() {
  // Önce geçerli ekranı kontrol edelim
  const currentScreen = document.querySelector('.screen-active');
  console.log("Back tuşuna basıldı, aktif ekran:", currentScreen ? currentScreen.id : "bulunamadı");
  console.log("Önceki ekranlar:", JSON.stringify(previousScreens));
  
  if (previousScreens.length > 0) {
    const lastScreenId = previousScreens.pop(); // Son açılan ekranı al
    console.log("Önceki ekrana dönülüyor:", lastScreenId);
    
    // Şu an aktif olan tüm ekranları gizle
    document.querySelectorAll('.screen-active').forEach(screen => {
      screen.style.display = 'none';
      screen.classList.remove('screen-active');
    });
    
    // 'menu' yerine doğrudan item-list-section'a dön - bu daha güvenli
    if (lastScreenId === 'menu') {
      showItemList(); // Menu boş olduğu için direk item liste dön
    } else {
      // Önceki ekranı bul ve göster
      const previousScreen = document.getElementById(lastScreenId);
      if (previousScreen) {
        previousScreen.style.display = 'block';
        previousScreen.classList.add('screen-active');
        console.log(`Returning to screen: ${lastScreenId}`);
      } else {
        console.error(`Previous screen not found: ${lastScreenId}`);
        showItemList(); // Eğer önceki ekran bulunamazsa ana liste ekranına dön
      }
    }
  } else {
    console.log('No previous screens in history, showing item list');
    showItemList(); // Eğer önceki ekran yoksa, ana ekrana dön
  }
}


// *****************
// Sepet İşlevleri
// *****************

function addToCart(product) {
  console.log("addToCart called with:", product);
  // Her eklemeyi ayrı bir kayıt olarak ekleyelim:
  let newProduct = { ...product, quantity: 1 };
  cart.push(newProduct);
  updateCartDisplay();
  showAddToCartNotification();
}

function showAddToCartNotification() {
  // Mevcut bildirimi temizle (eğer varsa)
  const existingNotification = document.getElementById('add-to-cart-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Yeni bildirimi oluştur
  const notification = document.createElement('div');
  notification.id = 'add-to-cart-notification';
  notification.classList.add('notification');
  notification.textContent = 'Ürün sepetinize eklendi!';
  
  // Bildirimin stilini ayarla
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = '#9b795c'; // İstenen kahverengi ton
  notification.style.color = 'white';
  notification.style.padding = '15px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  notification.style.zIndex = '9999';
  notification.style.fontWeight = 'bold';
  
  // Bildirimi DOM'a ekle
  document.body.appendChild(notification);
  
  // Bildirimi 3 saniye sonra gizle
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    
    // 0.5 saniye sonra tamamen kaldır
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 3000);
}

function updateCartDisplay() {
  let total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = `Cart (${total})`;
  }
  console.log("Cart updated:", cart);
}

function showCartScreen() {
  const cartScreen = document.getElementById('cart-screen');
  cartScreen.style.display = 'flex';
  cartScreen.innerHTML = '';  // Önceki içerikleri temizle
  showScreen('cart-screen');
  // **Kapatma Butonu**
  const closeButton = document.createElement('button');
  closeButton.className = 'close-btn';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', hideCartScreen);
  cartScreen.appendChild(closeButton);

  // **Başlık**
  const header = document.createElement('h2');
  header.textContent = 'Your Cart';
  cartScreen.appendChild(header);

  // **Sepet Ürünleri**
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'cart-items-container';

  if (cart.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Cart is currently empty.';
    itemsContainer.appendChild(emptyMessage);
  } else {
    let totalPrice = 0;

    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';

      const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
      const itemTotalPrice = itemPrice * item.quantity;
      totalPrice += itemTotalPrice;

      itemDiv.innerHTML = `
        <p>${item.name} (x${item.quantity})</p>
        <p class="cart-price">Unit Price: ${item.price}</p>
        <p class="cart-total">Total: ₺${itemTotalPrice.toFixed(2)}</p>
      `;

      itemsContainer.appendChild(itemDiv);
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total-container';
    totalDiv.innerHTML = `<h3>Total Price: ₺${totalPrice.toFixed(2)}</h3>`;
    itemsContainer.appendChild(totalDiv);
  }

  cartScreen.appendChild(itemsContainer);

  // **Talep Butonu (Request)**
  const requestButton = document.createElement('button');
  requestButton.id = 'request-btn';
  requestButton.textContent = 'Request';
  requestButton.addEventListener('click', showTimeSelectionPopup);
  cartScreen.appendChild(requestButton);
}

function hideCartScreen() {
  const cartScreen = document.getElementById('cart-screen');
  if (cartScreen) {
    cartScreen.style.display = 'none';
  }
}


// *****************
// Genel Menü Gösterimi
// *****************

function showMainMenu() {
  document.getElementById('item-list-section').style.display = 'none';
  document.getElementById('chatbot').style.display = 'none';
  document.getElementById('cart-screen').style.display = 'none';
  document.getElementById('time-popup').style.display = 'none';
  document.getElementById('menu').style.display = 'block';
  hideCartScreen();
}

function showScreen(newScreenId) {
  const currentScreen = document.querySelector('.screen-active'); // Şu an açık olan ekranı bul

  if (currentScreen) {
    previousScreens.push(currentScreen.id); // Önceki ekranı kaydet
    currentScreen.style.display = 'none';
    currentScreen.classList.remove('screen-active');
  }

  const newScreen = document.getElementById(newScreenId);
  if (newScreen) {
    newScreen.style.display = 'block';
    newScreen.classList.add('screen-active');
  }

  // **Dil seçim ekranını tekrar açmasını engelle**
  const languageSelection = document.getElementById("language-selection");
  if (languageSelection) {
    languageSelection.style.display = "none"; // Dil ekranını her zaman gizli tut
  }
}

let previousScreens = []; // Önceki ekranları kaydetmek için dizi

// *****************
// Zaman Seçim ve Talep İşlemleri
// *****************

function showTimeSelectionPopup() {
  // Zaman seçme pop-up'ını oluştur
  const timePopup = document.createElement('div');
  timePopup.id = 'time-selection-popup';
  timePopup.classList.add('popup-overlay');
  timePopup.innerHTML = `
    <div class="popup-content">
      <h3>What time would you like to get a service?</h3>
      <div class="time-options">
        <button id="btn-30">In 30 minutes</button>
        <button id="btn-60">In 1 hour</button>
        <button id="btn-120">In 2 hours</button>
        <button id="btn-240">In 4 hours</button>
      </div>
    </div>
  `;
  document.body.appendChild(timePopup);

  // Butonlara tıklama olaylarını ekleyin ve seçilen etiketi gönderin
  document.getElementById('btn-30').addEventListener('click', () => confirmServiceTime(30, 'In 30 minutes'));
  document.getElementById('btn-60').addEventListener('click', () => confirmServiceTime(60, 'In 1 hour'));
  document.getElementById('btn-120').addEventListener('click', () => confirmServiceTime(120, 'In 2 hours'));
  document.getElementById('btn-240').addEventListener('click', () => confirmServiceTime(240, 'In 4 hours'));
}
function confirmServiceTime(minutes, label) {
  // Zaman seçimi pop-up'ını kaldır (mevcut kod)
  const timePopup = document.getElementById('time-selection-popup');
  if (timePopup) {
    timePopup.remove();
  }

  // Şu anki saati al
  const now = new Date();
  const currentHour = now.getHours();

   // Hizmet verilmeyen saat aralığını kontrol et (00:00 ile 09:00 arası)
   if (currentHour >= 22 && currentHour < 10) {
    alert("We are currently not providing service. Our service hours are between 09:00 and 00:00.");
    return; // Fonksiyondan erken çık, kaydetme işlemini yapma
}


  console.log(`Service time set to ${minutes} minutes, option: ${label}`);

  // Seçilen zamanı localStorage'ye kaydet (dakika ve etiket) - mevcut kod
  localStorage.setItem('selectedServiceTime', minutes);
  localStorage.setItem('selectedServiceLabel', label);

  // Başarı mesajı pop-up'ını göster - mevcut kod
  showSuccessPopup();


}





function showSuccessPopup() {
  console.log("Popup açılıyor");
  // Başarı mesajını gösteren pop-up
  const successPopup = document.createElement('div');
  successPopup.id = 'success-popup';
  successPopup.classList.add('popup-overlay');
  successPopup.innerHTML = `
    <div class="popup-content success">
      <img src="assets/icons/keepsty-character.png" alt="Keepsty Logo" class="keepsty-logo">
      <p class="success-message">
        You are all set!<br>
      </p>
    </div>
  `;
  document.body.appendChild(successPopup);

  // 10 saniye sonra pop-up otomatik kapanır
  setTimeout(closeSuccessPopup, 3000);
}
function closeSuccessPopup() {
  // Başarı pop-up'ını kaldır
  const successPopup = document.getElementById('success-popup');
  if (successPopup) successPopup.remove();

  // **Önce sepet verisini kaydedin**
  saveCartToDB(cart);

  // Sepeti temizle ve ana ekrana dön
  cart = [];           // Sepeti boşalt
  updateCartDisplay(); // Sepet sayacını güncelle
  hideCartScreen();    // Sepet ekranını gizle
  showItemList();      // Ana menüyü göster
}

// *****************
// DOMContentLoaded: Başlangıç İşlemleri
// *****************

document.addEventListener('DOMContentLoaded', () => {
  loadLanguageSelection();

  // Cart butonuna olay dinleyicisi ekleyin
  const cartActionItem = document.getElementById('cart-action');
  if (cartActionItem) {
    cartActionItem.addEventListener('click', showCartScreen);
    console.log('Cart action listener eklendi.');
  } else {
    console.error('Cart action öğesi bulunamadı!');
  }
});

// Kapatma butonunu seç (eğer varsa)
const closeBtn = document.querySelector('.close-btn');
const cartScreen = document.getElementById('cart-screen');
if (closeBtn && cartScreen) {
  closeBtn.addEventListener('click', () => {
    cartScreen.style.display = 'none';
  });
}

// Sepeti açan fonksiyon (örnek olarak)
function openCart() {
  cartScreen.style.display = 'flex'; // CSS'de flex olarak ayarlandığı için
}

function saveCartToDB(cart) {
  // Toplam fiyatı hesaplayın
  let totalPrice = cart.reduce((sum, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
    return sum + (price * item.quantity);
  }, 0);

  // LocalStorage'den oda numarası, kullanıcı adı ve servis zamanı bilgilerini alın
  const roomNumber = localStorage.getItem('roomNumber') || "default";
  const username = localStorage.getItem('username') || "Unknown";
  const serviceTime = parseInt(localStorage.getItem('selectedServiceTime')) || 0;
  const serviceTimeLabel = localStorage.getItem('selectedServiceLabel') || "No service time selected";

  // Tek bir payload oluşturun
  const payload = {
    roomNumber: roomNumber,
    username: username,
    items: cart,
    totalPrice: totalPrice,
    serviceTime: serviceTime,
    serviceTimeLabel: serviceTimeLabel
  };

  fetch('https://keepstyback.onrender.com/saveRoomservice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Laundry saved:', data);
  })
  .catch(error => {
    console.error('Error saving laundry:', error);
  });
}
