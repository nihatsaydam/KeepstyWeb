// Varsayılan dil (dilerseniz URL parametresi veya başka bir yöntemle değiştirebilirsiniz)
let currentLanguage = localStorage.getItem('currentLanguage') || "turkish";

// Oda numarasını localStorage'dan alıyoruz (örnek olarak, girişte kaydedilmiş olduğunu varsayalım)
let roomNumber = localStorage.getItem('roomNumber') || "default_room"; // Gerçek uygulamada dinamik olmalı

// Her dil için anahtar kelime ve yanıt sözlükleri
const keywordResponses = {
  "turkish": {
    "kahvaltı": "Merhaba, kahvaltımız her gün sabah **07:00 - 10:30** saatleri arasında sunulmaktadır. Kahvaltı salonumuz otelin zemin katında yer almaktadır. Dilerseniz oda servisi ile de kahvaltınızı odanıza sipariş edebilirsiniz. Yardımcı olabileceğim başka bir konu var mı?",
    "giriş": "Giriş işlemlerimiz **14:00** itibarıyla başlamakta, çıkış (check-out) ise en geç **12:00**'de yapılmaktadır. Geç çıkış talebiniz varsa, memnuniyetle yardımcı olabiliriz.",
    "wifi": "Evet, otelimizde tüm alanlarda ücretsiz Wi-Fi hizmetimiz mevcuttur. Bağlanmak için ağa 'Hotel Wi-Fi' üzerinden giriş yapabilir, şifre olarak **Welcome2024** kullanabilirsiniz. Bağlantıda bir sorun yaşarsanız, hemen yardımcı olabilirim.",
    "otopark": "Evet, otelimizin konuklarına özel bir otoparkı bulunmaktadır ve tamamen **ücretsizdir**. Vale hizmetimizden de yararlanabilirsiniz. Aracınızı park etmenizle ilgili yardıma ihtiyacınız olursa hemen bildirin, size memnuniyetle destek oluruz.",
    "sigara": "Otelimizde odalarda sigara içmek yasaktır ancak sigara içilebilen özel alanlarımız mevcuttur. Bahçede ve teras katında belirlenmiş sigara içme bölümlerini kullanabilirsiniz.",
    "oda servisi": "Merhaba, oda servisimiz **07:00 - 23:00** saatleri arasında hizmet vermektedir. Menüden dilediğiniz yiyecek ve içecekleri sipariş verebilirsiniz. Yardımcı olabileceğim başka bir konu var mı?",
    "restoran": "Restoranımız kahvaltı için **07:00 - 10:30**, öğle yemeği için **12:00 - 15:00** ve akşam yemeği için **18:30 - 22:00** saatleri arasında açıktır. Barımız ise her gün **16:00 - 00:00** saatlerinde hizmet vermektedir. Rezervasyon veya menü hakkında bilgi almak isterseniz memnuniyetle yardımcı olurum.",
    "menü": "Elbette! Keepsty uygulaması üzerinden **Room Service** seçeneğine tıklayarak menümüze ulaşabilir ve dilediğiniz yiyecek-içecekleri kolayca sipariş verebilirsiniz. Yardıma ihtiyacınız olursa her zaman buradayım!",
    "havlu": "Elbette! Keepsty uygulamasındaki Housekeeping bölümünden ekstra havlu veya yastık talebinde bulunabilirsiniz. Talebinizi ilettikten sonra en kısa sürede odanıza teslim edeceğiz. Yardımcı olabileceğim başka bir şey var mı?",
    "temizlik": "Tabii ki! Odanızın temizlenmesini isterseniz **Keepsty uygulamasından Housekeeping** seçeneğine tıklayarak temizlik talebinde bulunabilirsiniz. Ekibimiz en kısa sürede odanıza gelecektir. Başka bir konuda yardımcı olabilir miyim?",
    "çamaşırhane": "Evet, otelimizde çamaşırhane ve ütü hizmeti mevcuttur. Hizmetlerimiz **ücretlidir** ve fiyat listesine **Keepsty uygulamasındaki Laundry** bölümünden ulaşabilirsiniz. Talep oluşturduğunuzda, ekibimiz çamaşırlarınızı almak için odanıza gelir. Yardıma ihtiyacınız olursa buradayım.",
    "klima": "Bu durum için üzgünüz! Klima arızasını çözmek için lütfen **Keepsty uygulamasından Technic** bölümüne girip arıza talebi oluşturun. Teknik ekibimiz en kısa sürede odanıza yönlendirilecektir. Başka bir konuda yardımcı olabilir miyim?",
    "spor salonu": "Spor salonumuz ve havuzumuz otelin -1 katında bulunmaktadır. Her gün **06:00 - 22:00** saatleri arasında hizmet vermektedir. Yardımcı olabileceğim başka bir konu varsa memnuniyetle destek olurum!",
    "spa": "Evet, otelimizde spa, masaj ve sauna hizmetleri otelimizin 3 katında mevcuttur. Bu hizmetlerden yararlanmak için **Keepsty uygulamasında Spa & Wellness** bölümünden kolayca rezervasyon yapabilirsiniz. Size uygun bir saat bulamazsanız memnuniyetle yardımcı olurum!",
    "çocuk": "Üzgünüz, otelimizde şu anda çocuklar için özel bir oyun alanı veya etkinlik programı bulunmamaktadır. Başka bir konuda size yardımcı olabilirim.",
    "transfer": "Evet, otelimizin çevresinde ziyaret edebileceğiniz birçok turistik nokta ve önerdiğimiz restoranlar bulunmaktadır. Detaylı bilgi almak için **Keepsty Concierge** üzerinden kolayca ulaşabilirsiniz. Size uygun seçenekler sunmaktan memnuniyet duyarım.",
    "taksi": "Elbette! **Keepsty uygulaması üzerinden taksi talebinde** bulununuz. Talebiniz iletildikten sonra en kısa sürede bir araç yönlendirilecektir. Başka bir konuda yardımcı olabilir miyim?",
    "geç çıkış": "Geç çıkış talebinizi memnuniyetle değerlendirebiliriz. Müsaitlik durumuna bağlı olarak geç çıkış imkanı sunuyoruz ve ücretlendirme, çıkış saatinize göre değişiklik gösterebilir. Detaylı bilgi almak ve talepte bulunmak ister misiniz?",
    "oda yükseltme": "Evet, müsaitlik durumuna bağlı olarak oda yükseltme seçeneğimiz mevcuttur. Detaylı bilgi almak ve talepte bulunmak ister misiniz?",
    "fatura": "Faturanız, check-out işleminizi tamamladıktan sonra otomatik olarak e-posta adresinize gönderilecektir. Yardımcı olabileceğim başka bir konu var mı?",
    "uyandırma": "Evet, uyandırma servisi talebinde bulunabilirsiniz. Talebiniz oluşturulduktan sonra belirttiğiniz saatte sizi arayarak uyandıracağız. Talepte bulunmak ister misiniz?",
    "bagaj": "Evet, çıkış yaptıktan sonra veya erken giriş yaptığınızda bagajlarınızı belirlenen alanda muhafaza edebiliriz. Yardımcı olabileceğim başka bir konuda size destek olmaktan memnuniyet duyarım!"
  },
  "english": {
    "breakfast": "Hello, our breakfast is served every day from **07:00 to 10:30**. The breakfast room is located on the ground floor of the hotel. You can also order breakfast to your room via room service. Can I help you with anything else?",
    "check-in": "Our check-in process starts at **14:00** and check-out is at **12:00** at the latest. If you need a late check-out, we are happy to assist you.",
    "wifi": "Yes, we offer free Wi-Fi throughout the hotel. To connect, join the 'Hotel Wi-Fi' network and use the password **Welcome2024**. If you have any issues, I'm here to help.",
    "parking": "Yes, our hotel provides a dedicated parking area for guests and it is completely **free**. Valet service is also available. Let me know if you need assistance with parking.",
    "smoking": "Smoking is prohibited in the rooms, but there are designated smoking areas available in the hotel, such as in the garden and terrace.",
    "room service": "Hello, our room service is available from **07:00 to 23:00**. You can order your favorite food and drinks from our menu. Can I help you with anything else?",
    "restaurant": "Our restaurant is open for breakfast from **07:00 to 10:30**, for lunch from **12:00 to 15:00**, and for dinner from **18:30 to 22:00**. Our bar is open daily from **16:00 to 00:00**. If you need reservations or menu information, I'm here to help.",
    "menu": "Sure! You can view our menu by clicking the **Room Service** option in the Keepsty app, and you can easily order food and drinks. I'm here if you need any further assistance.",
    "towel": "Sure! You can request extra towels or pillows through the Housekeeping section in the Keepsty app. Once your request is submitted, we will deliver them to your room as soon as possible. Do you need anything else?",
    "cleaning": "Of course! If you need your room cleaned, simply click on the Housekeeping option in the Keepsty app to request cleaning service. Our team will be at your room shortly. Can I assist you with anything else?",
    "laundry": "Yes, we offer laundry and ironing services, which are paid services. You can check the price list in the Laundry section of the Keepsty app. When you request the service, our team will pick up your laundry from your room. I'm here if you need any help.",
    "ac": "I'm sorry that your air conditioner isn't working! Please submit a maintenance request via the Technic section in the Keepsty app, and our technical team will be dispatched to your room as soon as possible. Can I help you with anything else?",
    "gym": "Our gym and pool are located on the -1 floor of the hotel and are available daily from **06:00 to 22:00**. If you need further assistance, please let me know!",
    "spa": "Yes, our hotel offers spa, massage, and sauna services on the 3rd floor. You can easily make a reservation through the Spa & Wellness section in the Keepsty app. If you can't find a suitable time, I'm happy to help.",
    "children": "I'm sorry, but currently there is no designated play area or activity program for children at our hotel. Can I help you with anything else?",
    "transfer": "Yes, our hotel offers airport transfer services and recommendations for local attractions and restaurants. For more details, please check the Keepsty Concierge section. Can I help you with anything else?",
    "taxi": "Of course! You can request a taxi through the Keepsty app. Once your request is submitted, a vehicle will be dispatched as soon as possible. Can I help you with anything else?",
    "late check-out": "We can accommodate late check-out based on availability, with charges varying according to your departure time. Would you like more details or to request a late check-out?",
    "upgrade": "Yes, subject to availability, we do offer room upgrade options. Would you like more details or to request an upgrade?",
    "invoice": "Your invoice will be automatically sent to your email address once you complete your check-out. Can I help you with anything else?",
    "wake-up": "Yes, you can request a wake-up call. Once your request is submitted, we will call you at your specified time. Would you like to request a wake-up call?",
    "luggage": "Yes, we offer luggage storage after check-out or during early check-in. Is there anything else I can help you with?"
  },
  "french": {
    "petit-déjeuner": "Bonjour, notre petit-déjeuner est servi tous les jours de **07:00 à 10:30**. La salle de petit-déjeuner se trouve au rez-de-chaussée de l'hôtel. Vous pouvez également commander votre petit-déjeuner en chambre via le service d'étage. Puis-je vous aider avec autre chose ?",
    "check-in": "Nos procédures d'enregistrement commencent à **14:00** et le départ doit être effectué avant **12:00**. Si vous avez besoin d'un départ tardif, nous serons ravis de vous aider.",
    "wifi": "Oui, notre hôtel propose un Wi-Fi gratuit dans tout l'établissement. Pour vous connecter, rejoignez le réseau 'Hotel Wi-Fi' et utilisez le mot de passe **Welcome2024**. Si vous rencontrez un problème, je suis là pour vous aider.",
    "stationnement": "Oui, notre hôtel dispose d'un parking réservé aux clients et il est entièrement **gratuit**. Un service de voiturier est également disponible. Faites-moi savoir si vous avez besoin d'aide pour le stationnement.",
    "fumeurs": "Il est interdit de fumer dans les chambres, mais il existe des espaces fumeurs désignés dans l'hôtel, comme dans le jardin et sur la terrasse.",
    "service en chambre": "Bonjour, notre service en chambre est disponible de **07:00 à 23:00**. Vous pouvez commander les plats et boissons de votre choix depuis notre menu. Puis-je vous aider avec autre chose ?",
    "restaurant": "Notre restaurant est ouvert pour le petit-déjeuner de **07:00 à 10:30**, pour le déjeuner de **12:00 à 15:00** et pour le dîner de **18:30 à 22:00**. Notre bar est ouvert tous les jours de **16:00 à 00:00**. Si vous avez besoin d'une réservation ou d'informations sur le menu, je suis à votre disposition.",
    "menu": "Bien sûr ! Vous pouvez consulter notre menu en cliquant sur l'option **Room Service** dans l'application Keepsty, et vous pouvez facilement commander vos plats et boissons préférés. Je suis ici pour toute aide supplémentaire.",
    "serviettes": "Bien sûr ! Vous pouvez demander des serviettes ou oreillers supplémentaires via la section Housekeeping de l'application Keepsty. Une fois votre demande soumise, nous vous les livrerons dans votre chambre dès que possible. Puis-je vous aider avec autre chose ?",
    "nettoyage": "Bien entendu ! Si vous souhaitez que votre chambre soit nettoyée, veuillez cliquer sur l'option Housekeeping dans l'application Keepsty pour demander un service de nettoyage. Notre équipe arrivera dans votre chambre dès que possible. Puis-je vous aider avec autre chose ?",
    "blanchisserie": "Oui, notre hôtel propose des services de blanchisserie et de repassage, qui sont payants. Vous pouvez consulter la liste des prix dans la section Laundry de l'application Keepsty. Lorsque vous faites une demande, notre équipe récupérera votre linge dans votre chambre. Je suis là pour toute aide supplémentaire.",
    "climatisation": "Nous sommes désolés pour le désagrément ! Pour résoudre le problème de la climatisation, veuillez soumettre une demande via la section Technic de l'application Keepsty, et notre équipe technique se rendra dans votre chambre dès que possible. Puis-je vous aider avec autre chose ?",
    "salle de sport": "Notre salle de sport et notre piscine se trouvent au sous-sol (niveau -1) de l'hôtel et sont accessibles tous les jours de **06:00 à 22:00**. Puis-je vous aider avec autre chose ?",
    "spa": "Oui, notre hôtel dispose de services de spa, massage et sauna situés au 3ème étage. Vous pouvez facilement réserver via la section Spa & Wellness de l'application Keepsty. Si vous ne trouvez pas un horaire qui vous convient, je suis là pour vous aider.",
    "enfants": "Nous sommes désolés, mais notre hôtel ne dispose actuellement pas d'une aire de jeux ou d'un programme d'activités pour enfants. Puis-je vous aider avec autre chose ?",
    "transfert": "Oui, nous offrons des services de transfert depuis l'aéroport ainsi que des recommandations touristiques locales. Pour plus d'informations, veuillez consulter la section Keepsty Concierge. Puis-je vous aider avec autre chose ?",
    "taxi": "Bien sûr ! Vous pouvez commander un taxi via l'application Keepsty. Une fois votre demande soumise, un véhicule sera envoyé dans les plus brefs délais. Puis-je vous aider avec autre chose ?",
    "départ tardif": "Nous pouvons envisager un départ tardif en fonction de la disponibilité, avec des frais variables selon l'heure de départ. Souhaitez-vous obtenir plus de détails ou faire une demande de départ tardif ?",
    "surclassement": "Oui, sous réserve de disponibilité, nous offrons des options de surclassement de chambre. Souhaitez-vous plus de détails ou faire une demande de surclassement ?",
    "facture": "Votre facture sera automatiquement envoyée à votre adresse e-mail après avoir terminé votre check-out. Puis-je vous aider avec autre chose ?",
    "réveil": "Oui, vous pouvez demander un service de réveil. Une fois votre demande soumise, nous vous appellerons à l'heure indiquée. Souhaitez-vous demander un réveil ?",
    "bagages": "Oui, nous offrons un service de consigne pour vos bagages après le check-out ou en cas d'arrivée anticipée. Puis-je vous aider avec autre chose ?"
  },
  "arabic": {
    "الإفطار": "مرحباً، يُقدم الإفطار لدينا يومياً من **07:00 - 10:30**. تقع صالة الإفطار في الطابق الأرضي من الفندق. يمكنك أيضاً طلب الإفطار إلى غرفتك عبر خدمة الغرف. هل يمكنني مساعدتك في أمر آخر؟",
    "تسجيل الوصول": "تبدأ إجراءات تسجيل الوصول لدينا من **14:00**، ويجب إنهاء إجراءات تسجيل المغادرة قبل **12:00**. إذا كنت تحتاج إلى تسجيل مغادرة متأخر، سنكون سعداء بمساعدتك.",
    "واي فاي": "نعم، يتوفر لدينا خدمة الواي فاي المجانية في جميع أنحاء الفندق. للاتصال، انضم إلى شبكة 'Hotel Wi-Fi' واستخدم كلمة المرور **Welcome2024**. إذا واجهت أي مشكلة، أنا هنا لمساعدتك.",
    "موقف السيارات": "نعم، يوفر الفندق موقف سيارات خاص للنزلاء وهو **مجاني** تماماً. كما يتوفر خدمة الكفال. إذا كنت بحاجة إلى مساعدة بشأن موقف السيارات، يُرجى إعلامنا.",
    "مناطق التدخين": "التدخين محظور في الغرف، ولكن يوجد مناطق مخصصة للتدخين في الفندق، مثل الحديقة والتراس.",
    "خدمة الغرف": "مرحباً، خدمة الغرف لدينا متوفرة من **07:00 - 23:00**. يمكنك طلب الطعام والشراب من القائمة المتوفرة. هل يمكنني مساعدتك في أمر آخر؟",
    "المطعم": "يعمل مطعمنا على تقديم الإفطار من **07:00 - 10:30**، الغداء من **12:00 - 15:00** والعشاء من **18:30 - 22:00**. كما يعمل البار يومياً من **16:00 - 00:00**. إذا كنت بحاجة إلى حجز أو معلومات حول القائمة، فأنا هنا لمساعدتك.",
    "القائمة": "بالتأكيد! يمكنك عرض قائمتنا عن طريق النقر على خيار **Room Service** في تطبيق Keepsty، ويمكنك طلب الطعام والشراب بسهولة. أنا هنا لأي مساعدة إضافية.",
    "مناشف": "بالتأكيد! يمكنك طلب مناشف أو وسائد إضافية من خلال قسم Housekeeping في تطبيق Keepsty. بعد تقديم طلبك، سنقوم بتوصيلها إلى غرفتك في أقرب وقت ممكن. هل تحتاج إلى مساعدة في أمر آخر؟",
    "تنظيف": "بالطبع! إذا كنت ترغب في تنظيف غرفتك، يرجى النقر على خيار Housekeeping في تطبيق Keepsty لتقديم طلب التنظيف. سيصل فريقنا إلى غرفتك في أقرب وقت ممكن. هل يمكنني مساعدتك في أمر آخر؟",
    "غسيل": "نعم، يقدم الفندق خدمة الغسيل والكي، وهي خدمات مدفوعة. يمكنك الاطلاع على قائمة الأسعار من خلال قسم Laundry في تطبيق Keepsty. عند تقديم الطلب، سيقوم فريقنا باستلام الغسيل من غرفتك. أنا هنا لأي مساعدة إضافية.",
    "تكييف": "نأسف لعدم عمل التكييف في غرفتك! يرجى تقديم طلب صيانة عبر قسم Technic في تطبيق Keepsty، وسيرسل فريقنا الفني إلى غرفتك في أقرب وقت ممكن. هل يمكنني مساعدتك في أمر آخر؟",
    "الصالة الرياضية": "تقع صالة الألعاب الرياضية والمسبح في الطابق -1 من الفندق وتعمل يومياً من **06:00 - 22:00**. هل يمكنني مساعدتك في أمر آخر؟",
    "السبا": "نعم، يتوفر في الفندق خدمات السبا، التدليك والساونا في الطابق الثالث. يمكنك الحجز بسهولة من خلال قسم Spa & Wellness في تطبيق Keepsty. إذا لم تجد الوقت المناسب، سأكون سعيداً بمساعدتك.",
    "الأطفال": "نأسف، لكن لا يوجد في الفندق حالياً منطقة مخصصة للأطفال أو برنامج للأنشطة. هل يمكنني مساعدتك في أمر آخر؟",
    "النقل": "نعم، نقدم خدمات النقل من وإلى المطار بالإضافة إلى توصيات حول المعالم السياحية والمطاعم المحلية. للحصول على معلومات مفصلة، يرجى زيارة قسم Keepsty Concierge. هل يمكنني مساعدتك في أمر آخر؟",
    "تاكسي": "بالتأكيد! يمكنك طلب تاكسي عبر تطبيق Keepsty. بعد تقديم الطلب، سيتم إرسال سيارة في أقرب وقت ممكن. هل يمكنني مساعدتك في أمر آخر؟",
    "تسجيل المغادرة المتأخر": "يمكننا تقديم خدمة تسجيل المغادرة المتأخر بناءً على التوفر، مع رسوم تختلف حسب وقت المغادرة. هل ترغب في الحصول على مزيد من التفاصيل أو تقديم طلب تسجيل مغادرة متأخر؟",
    "ترقية الغرفة": "نعم، بناءً على التوفر، نقدم خيار ترقية الغرفة. هل ترغب في الحصول على مزيد من التفاصيل أو تقديم طلب ترقية؟",
    "الفاتورة": "ستُرسل فاتورتك تلقائياً إلى بريدك الإلكتروني بعد إتمام إجراءات تسجيل المغادرة. هل يمكنني مساعدتك في أمر آخر؟",
    "إيقاظ": "نعم، يمكنك طلب خدمة إيقاظ. بعد تقديم طلبك، سنقوم بالاتصال بك في الوقت المحدد. هل ترغب في طلب خدمة إيقاظ؟",
    "الأمتعة": "نعم، يمكننا تخزين أمتعتك بعد تسجيل المغادرة أو عند الوصول المبكر. هل يمكنني مساعدتك في أمر آخر؟"
  }
};

// Sayfa yüklendiğinde çalışacak işlemler
document.addEventListener("DOMContentLoaded", function() {
  // Eğer chatbot alanınız başlangıçta gizliyse, gösteriyoruz:
  const chatbot = document.getElementById("chatbot");
  if (chatbot) {
    chatbot.style.display = "block";
  }

  // Dört dilde hoş geldiniz mesajları
  const welcomeMessages = {
    "turkish": "Ask Keepsty'ye hoş geldiniz! 👋 Konaklamanızı kolay ve keyifli hale getirmek için buradayım. Check-in & check-out saatleri, oda detayları, Wi-Fi erişimi, yemek seçenekleri, Housekeeping, spa hizmetleri veya yerel aktiviteler hakkında bilgi almak isterseniz sorunuzu iletebilirsiniz.",
    "english": "Welcome to Ask Keepsty! 👋 I'm here to make your stay seamless and enjoyable. Whether you need information about check-in & check-out times, room details, Wi-Fi access, dining options, housekeeping, spa services, or local attractions, just ask!",
    "french": "Bienvenue sur Ask Keepsty! 👋 Je suis ici pour rendre votre séjour agréable et sans souci. Que vous ayez besoin d'informations sur les horaires d'enregistrement et de départ, les détails de la chambre, l'accès au Wi-Fi, les options de restauration, le service d'étage, le spa ou les attractions locales, n'hésitez pas à demander!",
    "arabic": "مرحباً بكم في Ask Keepsty! 👋 أنا هنا لجعل إقامتكم سلسة وممتعة. سواء كنتم بحاجة إلى معلومات عن مواعيد تسجيل الوصول والمغادرة، تفاصيل الغرفة، الوصول إلى الواي فاي، خيارات الطعام، خدمة التنظيف، خدمات السبا، أو المعالم السياحية المحلية، فقط اسألوا!"
  };

  // Seçilen dilin hoş geldiniz mesajını alıyoruz
  const selectedWelcomeMessage = welcomeMessages[currentLanguage] || welcomeMessages["english"];
  addMessageToChat(selectedWelcomeMessage, "bot");
});

// Fonksiyon: Kullanıcı mesajına göre uygun yanıtı bulur
function findResponseForMessage(userMessage) {
  const message = userMessage.toLowerCase();
  const responses = keywordResponses[currentLanguage];
  for (let keyword in responses) {
    if (message.includes(keyword.toLowerCase())) {
      return responses[keyword];
    }
  }
  // Eşleşen bir anahtar kelime bulunamadıysa varsayılan yanıtı döndür
  const defaultResponses = {
    "turkish": "Üzgünüm, sorunuza uygun bir yanıt bulamadım. Lütfen soruyu farklı şekilde ifade edebilir misiniz?",
    "english": "I'm sorry, I couldn't find a suitable answer. Could you please rephrase your question?",
    "french": "Je suis désolé, je n'ai pas trouvé de réponse appropriée. Pourriez-vous reformuler votre question ?",
    "arabic": "عذرًا، لم أتمكن من إيجاد إجابة مناسبة. هل يمكنك إعادة صياغة سؤالك؟"
  };
  return defaultResponses[currentLanguage] || defaultResponses["english"];
}

// Fonksiyon: Mesajı sohbet kutusuna ekler ve ekranı aşağı kaydırır
function addMessageToChat(message, sender) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.className = "message " + sender;
  messageDiv.innerText = message;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Fonksiyon: Kullanıcı mesajı gönderme işlemini gerçekleştirir
function sendMessage() {
  const inputField = document.getElementById("message-input");
  const userMessage = inputField.value.trim();
  if (userMessage === "") {
    alert("Lütfen bir şey yazın / Please type a message / Veuillez taper un message / الرجاء كتابة رسالة");
    return;
  }
  // Kullanıcı mesajını ekle
  addMessageToChat(userMessage, "user");
  inputField.value = "";

  // Kullanıcı mesajı için payload oluştur
  const userPayload = {
    roomNumber: roomNumber, // Oda numarasını dinamik olarak alıyoruz
    message: userMessage,
    sender: "user",
    status: "waiting"
  };
  ask1(userPayload); // Kullanıcı mesajını kaydet

  // Yazıyor animasyonu göster
  showTypingIndicator();

  // 1 saniye sonra bot yanıtını ekle
  setTimeout(() => {
    hideTypingIndicator();
    const botResponse = findResponseForMessage(userMessage);
    addMessageToChat(botResponse, "bot");

    // Bot yanıtı için payload oluştur
    const botPayload = {
      roomNumber: roomNumber, // Oda numarasını dinamik olarak alıyoruz
      message: botResponse,
      sender: "bot",
      status: "waiting"
    };
    ask1(botPayload); // Bot yanıtını kaydet
  }, 1000);
}

// Fonksiyon: Yazıyor (typing) göstergesini açar
function showTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) {
    indicator.style.display = "block";
  }
}

// Fonksiyon: Yazıyor (typing) göstergesini kapatır
function hideTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) {
    indicator.style.display = "none";
  }
}

// Keepsty modeline uygun mesaj kaydetme fonksiyonu (ask1)
function ask1(payload) {
  console.log('Gönderilen payload:', payload); // Payload’u kontrol et
  fetch('https://keepstyback.onrender.com/ask1', { // Göreceli yol kullanılıyor
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
    .then(response => {
      console.log('Sunucu yanıtı:', response.status); // Durum kodunu kontrol et
      return response.json();
    })
    .then(data => console.log('Mesaj veritabanına kaydedildi:', data))
    .catch(error => console.error('Mesaj kaydedilirken hata oluştu:', error));
}

// Belirli bir odanın mesajlarını çeken fonksiyon (ask2)
function ask2(roomNumber) {
  fetch(`https://keepstyback.onrender.com/ask2/${roomNumber}`)
    .then(response => response.json())
    .then(data => {
      console.log(`Oda ${roomNumber} için mesajlar:`, data);
      loadMessages(data); // Sağ panele mesajları yükleyen fonksiyon (uygulamanızda tanımlı olmalı)
    })
    .catch(error => console.error(`Oda mesajları çekilirken hata oluştu (Oda ${roomNumber}):`, error));
}

// Örnek: Mesajları yükleme fonksiyonu (uygulamanıza göre düzenleyin)
function loadMessages(messages) {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = ""; // Önceki mesajları temizle
  messages.forEach(msg => {
    addMessageToChat(msg.message, msg.sender);
  });
}