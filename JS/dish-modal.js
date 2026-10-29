/**
 * ILISH · The Taste of Bengal
 * Dish Heritage Modal — Streamlined Fine-Dining Experience
 */

(function () {
  const DISH_DATABASE = {
    'doi_ilish': {
      id: 'doi_ilish',
      name: 'Doi Ilish',
      bn: 'দই ইলিশ',
      tag: "Chef's Signature",
      price: '₹1,450',
      isVeg: false,
      img: 'IMAGES/doi_ilish.webp',
      story: 'Fresh Hilsa steak simmered in stone-ground yellow mustard, whipped earthen curd, and green chillies with cold-pressed mustard oil.',
      spices: ['Yellow Mustard', 'Earthen Curd', 'Mustard Oil', 'Green Chillies'],
      pairing: 'Steamed Gobindobhog Rice'
    },
    'chingri_malaikari': {
      id: 'chingri_malaikari',
      name: 'Chingri Malaikari',
      bn: 'চিংড়ি মালাইকারি',
      tag: 'Royal Feast',
      price: '₹1,650',
      isVeg: false,
      img: 'IMAGES/chingri_malaikari.webp',
      story: 'Jumbo tiger prawns gently poached in rich coconut cream, fragrant cardamom, cinnamon quills, and a touch of pure cow ghee.',
      spices: ['Coconut Cream', 'Green Cardamom', 'Cinnamon', 'Cow Ghee'],
      pairing: 'Basanti Pulao or Scented Rice'
    },
    'ilish_paturi': {
      id: 'ilish_paturi',
      name: 'Bhetki / Ilish Macher Paturi',
      bn: 'ভেটকি / ইলিশ পাতুড়ি',
      tag: 'Banana Leaf Wrap',
      price: '₹1,550',
      isVeg: false,
      img: 'IMAGES/ilish_paturi.webp',
      story: 'Fresh fish wrapped in banana leaves with pungent Kasundi mustard, green chillies and mustard oil, then gently steamed to lock in its rich aroma.',
      spices: ['Kasundi Mustard', 'Fresh Coconut', 'Cold-pressed Mustard Oil', 'Green Chillies'],
      pairing: 'Steamed Rice with a drizzle of Ghee'
    },
    'ilish_macher_jhol': {
      id: 'ilish_macher_jhol',
      name: 'Ilish Macher Jhol',
      bn: 'ইলিশ মাছের ঝোল',
      tag: 'Monsoon Special',
      price: '₹1,350',
      isVeg: false,
      img: 'IMAGES/ilish_macher_jhol.webp',
      story: 'A light, restorative Hilsa broth tempered with aromatic nigella seeds, tender potatoes, and fresh green chillies.',
      spices: ['Nigella Seeds (Kalo Jeere)', 'Turmeric', 'Green Chillies', 'Potatoes'],
      pairing: 'Piping Hot Steamed Rice'
    },
    'ilish_kalia': {
      id: 'ilish_kalia',
      name: 'Ilish Kalia',
      bn: 'ইলিশ কালিয়া',
      tag: 'Festive Classic',
      price: '₹1,450',
      isVeg: false,
      img: 'IMAGES/ilish_kalia.webp',
      story: 'Pan-seared Hilsa braised in a celebratory, dark onion and ginger gravy infused with shahi garam masala and golden sultanas.',
      spices: ['Caramelized Onions', 'Ginger Essence', 'Shahi Garam Masala', 'Mustard Oil'],
      pairing: 'Dhakai Pulao or Hot Lucchi'
    },
    'kosha_mangsho': {
      id: 'kosha_mangsho',
      name: 'Kosha Mangsho',
      bn: 'কষা মাংস',
      tag: 'Bengali Heritage',
      price: '₹1,250',
      isVeg: false,
      img: 'IMAGES/kosha_mangsho.webp',
      story: 'Prime cuts of tender goat meat slow-braised for hours in cast iron with browned onions, garlic, and whole spices.',
      spices: ['Tender Goat Meat', 'Browned Shallots', 'Kashmiri Mirch', 'Mustard Oil'],
      pairing: 'Hot Lucchi or Basanti Pulao'
    },
    'chicken_dakbungalow': {
      id: 'chicken_dakbungalow',
      name: 'Chicken Dakbungalow',
      bn: 'চিকেন ডাকবাংলো',
      tag: 'Colonial Recipe',
      price: '₹950',
      isVeg: false,
      img: 'IMAGES/chicken_dakbungalow.webp',
      story: 'Country chicken simmered with dry-roasted whole spices, braised potatoes, and golden shallow-fried eggs in an earthy colonial-style gravy.',
      spices: ['Country Chicken', 'Whole Coriander', 'Golden Eggs', 'Potatoes'],
      pairing: 'Steamed Rice or Tandoori Roti'
    },
    'aloo_posto': {
      id: 'aloo_posto',
      name: 'Aloo Posto',
      bn: 'আলু পোস্ত',
      tag: 'Comfort Classic',
      price: '₹650',
      isVeg: true,
      img: 'IMAGES/posto.webp',
      story: 'Tender potato cubes cloaked in a nutty paste of stone-ground white poppy seeds, finished with raw mustard oil and green chillies.',
      spices: ['White Poppy Seeds (Posto)', 'Diced Potatoes', 'Mustard Oil', 'Green Chillies'],
      pairing: 'Biulir Dal & Steamed Rice'
    },
    'chanar_dalna': {
      id: 'chanar_dalna',
      name: 'Chanar Dalna',
      bn: 'ছানার ডালনা',
      tag: 'Temple Tradition',
      price: '₹750',
      isVeg: true,
      img: 'IMAGES/chanardalna.webp',
      story: 'Hand-kneaded fresh cottage cheese koftas gently simmered in a fragrant cumin-ginger jus without onion or garlic.',
      spices: ['Fresh Chenna', 'Cumin & Ginger', 'Hing (Asafoetida)', 'Pure Cow Ghee'],
      pairing: 'Radhaballabhi or Steamed Rice'
    },
    'mishti_doi': {
      id: 'mishti_doi',
      name: 'Mishti Doi & Roshogolla',
      bn: 'মিষ্টি দই ও রসগোল্লা',
      tag: 'Artisanal Sweet End',
      price: '₹450',
      isVeg: true,
      img: 'IMAGES/mishti_doi.webp',
      story: 'Silky caramelized yogurt cultured overnight in earthen pots, served alongside soft chenna Roshogollas soaked in light cardamom syrup.',
      spices: ['Caramelized Milk', 'Nolen Gur', 'Cardamom', 'Chenna Roshogolla'],
      pairing: 'Served in Traditional Clay Khurpi'
    }
  };

  let previousActiveElement = null;

  function createModalHtml() {
    let backdrop = document.getElementById('dishModalBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'dishModalBackdrop';
      backdrop.className = 'dish-modal-backdrop';
      backdrop.setAttribute('role', 'dialog');
      backdrop.setAttribute('aria-modal', 'true');
      backdrop.setAttribute('aria-labelledby', 'dishModalTitle');
      document.body.appendChild(backdrop);

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeDishModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop.classList.contains('active')) {
          closeDishModal();
        }
      });
    }
    return backdrop;
  }

  function openDishModal(dishKey) {
    const dish = DISH_DATABASE[dishKey];
    if (!dish) return;

    previousActiveElement = document.activeElement;
    const backdrop = createModalHtml();

    const ingredientsText = dish.spices && dish.spices.length > 0 ? dish.spices.join(' · ') : '';

    backdrop.innerHTML = `
      <div class="dish-modal-dialog" role="document">
        <button type="button" class="dish-modal-close" id="closeDishModalBtn" aria-label="Close dish details">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="dish-modal-visual">
          <img src="${dish.img}" alt="${dish.name}" class="dish-modal-img">
          ${dish.tag ? `<span class="dish-modal-badge">${dish.tag}</span>` : ''}
        </div>

        <div class="dish-modal-content">
          <div class="dish-modal-body">
            <!-- LEVEL 1: Dish Identity -->
            <div class="dish-modal-header">
              <span class="dish-modal-bn">${dish.bn}</span>
              <div class="dish-modal-title-row">
                <h2 class="dish-modal-title" id="dishModalTitle">${dish.name}</h2>
                <span class="dish-modal-price">${dish.price}</span>
              </div>
            </div>

            <!-- LEVEL 2: Essential Information -->
            <p class="dish-modal-description">${dish.story}</p>

            <!-- LEVEL 3: Supporting Details -->
            <div class="dish-modal-meta">
              <div class="dish-diet-row">
                <span class="dish-diet-badge ${dish.isVeg ? 'veg' : 'non-veg'}">
                  <span class="diet-dot" aria-hidden="true"></span>
                  <span class="diet-label">${dish.isVeg ? 'VEGETARIAN' : 'NON-VEG'}</span>
                </span>
              </div>

              ${ingredientsText ? `
                <div class="dish-ingredients-row">
                  <span class="dish-ingredients-text">${ingredientsText}</span>
                </div>
              ` : ''}

              ${dish.pairing ? `
                <div class="dish-pairing-row">
                  <span class="pairing-icon" aria-hidden="true">&#10022;</span>
                  <span class="pairing-label">Pairing:</span>
                  <span class="pairing-dish">${dish.pairing}</span>
                </div>
              ` : ''}
            </div>
          </div>

          <!-- LEVEL 4: Primary Action -->
          <div class="dish-modal-footer">
            <a href="reservation.html?preorder=${encodeURIComponent(dish.name)}" class="btn-reserve-dish" id="dishModalReserveBtn" aria-label="Reserve a Table for ${dish.name}">
              <span>Reserve a Table</span>
              <svg class="btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;

    const closeBtn = document.getElementById('closeDishModalBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeDishModal);
    }

    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Move focus inside dialog for accessibility
    setTimeout(() => {
      if (closeBtn) closeBtn.focus();
    }, 50);

    // Trap focus inside modal
    setupFocusTrap(backdrop);
  }

  function setupFocusTrap(modal) {
    modal.onkeydown = function (e) {
      if (e.key !== 'Tab') return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
  }

  function closeDishModal() {
    const backdrop = document.getElementById('dishModalBackdrop');
    if (backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    }
  }

  // Bind to cards on menu page
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      let matchedKey = card.getAttribute('data-dish-key');
      const img = card.querySelector('img');
      const h3 = card.querySelector('h3');

      if (!matchedKey) {
        const src = (img && img.getAttribute('src')) || '';
        const title = (h3 && h3.textContent.trim().toLowerCase()) || '';
        for (const k of Object.keys(DISH_DATABASE)) {
          if (src.includes(k) || title.includes(DISH_DATABASE[k].name.toLowerCase())) {
            matchedKey = k;
            break;
          }
        }
      }

      if (matchedKey && DISH_DATABASE[matchedKey]) {
        card.setAttribute('data-dish-key', matchedKey);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('aria-label', `View culinary details for ${DISH_DATABASE[matchedKey].name}`);
        card.style.cursor = 'pointer';

        card.addEventListener('click', (e) => {
          if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) return;
          openDishModal(matchedKey);
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) return;
            e.preventDefault();
            openDishModal(matchedKey);
          }
        });
      }
    });

    // Check if URL has ?dish= parameter to auto-open
    const params = new URLSearchParams(window.location.search);
    const dishParam = params.get('dish');
    if (dishParam && DISH_DATABASE[dishParam]) {
      setTimeout(() => openDishModal(dishParam), 300);
    }
  });

  window.openDishHeritageModal = openDishModal;
  window.closeDishHeritageModal = closeDishModal;
})();
