/* ==========================================================================
   Taste of Bengal - Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navMenuBtn = document.getElementById('navMenuBtn');
  const navDrawerBackdrop = document.getElementById('navDrawerBackdrop');
  const closeNavDrawerBtn = document.getElementById('closeNavDrawerBtn');
  const navDrawerItems = document.querySelectorAll('[data-nav-target]');
  const navLinkFoodMenu = document.getElementById('navLinkFoodMenu');
  const navLinkReservation = document.getElementById('navLinkReservation');

  const exploreMenuBtn = document.getElementById('exploreMenuBtn');
  const sigExploreMenuBtn = document.getElementById('sigExploreMenuBtn');
  const storyExploreMenuBtn = document.getElementById('storyExploreMenuBtn');
  const reservationBtn = document.getElementById('navReservationBtn');
  const scrollIndicator = document.getElementById('scrollIndicator');
  
  const menuDrawerBackdrop = document.getElementById('menuDrawerBackdrop');
  const closeMenuDrawerBtn = document.getElementById('closeMenuDrawerBtn');
  
  const reservationModalBackdrop = document.getElementById('reservationModalBackdrop');
  const closeReservationModalBtn = document.getElementById('closeReservationModalBtn');
  const reservationForm = document.getElementById('reservationForm');
  const toastNotification = document.getElementById('toastNotification');

  // --- Site Navigation Drawer Handlers ---
  function openNavDrawer(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (navDrawerBackdrop) {
      navDrawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (navMenuBtn) navMenuBtn.setAttribute('aria-expanded', 'true');
      if (closeNavDrawerBtn) {
        setTimeout(() => closeNavDrawerBtn.focus(), 50);
      }
    }
  }

  function closeNavDrawer() {
    if (navDrawerBackdrop && navDrawerBackdrop.classList.contains('active')) {
      navDrawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (navMenuBtn) {
        navMenuBtn.setAttribute('aria-expanded', 'false');
        navMenuBtn.focus();
      }
    }
  }

  if (navMenuBtn) navMenuBtn.addEventListener('click', openNavDrawer);
  if (closeNavDrawerBtn) closeNavDrawerBtn.addEventListener('click', closeNavDrawer);

  if (navDrawerBackdrop) {
    // Backdrop click close
    navDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === navDrawerBackdrop) {
        closeNavDrawer();
      }
    });

    // Keyboard focus trap inside drawer
    navDrawerBackdrop.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && navDrawerBackdrop.classList.contains('active')) {
        const focusableEls = Array.from(
          navDrawerBackdrop.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusableEls.length > 0) {
          const firstEl = focusableEls[0];
          const lastEl = focusableEls[focusableEls.length - 1];
          if (e.shiftKey && document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          } else if (!e.shiftKey && document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Smooth scroll and handle section links inside Navigation Drawer
  const allDrawerLinks = document.querySelectorAll('.nav-editorial-item');
  if (allDrawerLinks) {
    allDrawerLinks.forEach(item => {
      item.addEventListener('click', (e) => {
        const targetId = item.getAttribute('data-nav-target');
        if (targetId) {
          e.preventDefault();
          closeNavDrawer();
          if (targetId === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          }
        } else {
          // For direct page navigation links (e.g. reservation.html)
          closeNavDrawer();
        }
      });
    });
  }

  // Active navigation section indicator on scroll
  const sectionsToTrack = [
    { id: 'top', linkTarget: 'top' },
    { id: 'signature-dishes', linkTarget: 'signature-dishes' },
    { id: 'food-story', linkTarget: 'food-story' }
  ];

  function updateActiveDrawerState() {
    let currentActive = 'top';
    const scrollPosition = window.scrollY + 250;

    sectionsToTrack.forEach(sec => {
      const el = document.getElementById(sec.id);
      if (el && el.offsetTop <= scrollPosition) {
        currentActive = sec.linkTarget;
      }
    });

    if (window.scrollY < 100) {
      currentActive = 'top';
    }

    allDrawerLinks.forEach(link => {
      const target = link.getAttribute('data-nav-target');
      if (target && target === currentActive) {
        link.classList.add('active');
      } else if (target) {
        link.classList.remove('active');
      }
    });
  }

  // --- Navbar Scroll Appearance ---
  const navbar = document.querySelector('.navbar');
  function handleNavbarScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  if (document.querySelector('.hero-canvas')) {
    window.addEventListener('scroll', updateActiveDrawerState, { passive: true });
    updateActiveDrawerState();
  }

  // --- Food Menu Drawer Handlers (if drawer backdrop is present) ---
  function openMenuDrawer(e) {
    if (!menuDrawerBackdrop) return;
    if (e && e.preventDefault) e.preventDefault();
    menuDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenuDrawer() {
    if (!menuDrawerBackdrop) return;
    menuDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (menuDrawerBackdrop) {
    if (closeMenuDrawerBtn) closeMenuDrawerBtn.addEventListener('click', closeMenuDrawer);
    menuDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === menuDrawerBackdrop) {
        closeMenuDrawer();
      }
    });
  }

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 4000);
  }

  // --- Escape Key to Close Overlays ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNavDrawer();
      closeMenuDrawer();
    }
  });

  // --- Subtle Cursor Parallax Stage Effects ---
  const heroDish = document.querySelector('.dish-img');
  if (heroDish) {
    let targetX = 0;
    let targetY = 0;
    let currentDishX = 0;
    let currentDishY = 0;

    window.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2;
      targetY = (e.clientY / innerHeight - 0.5) * 2;
    });

    function animateParallax() {
      currentDishX += (targetX * 10 - currentDishX) * 0.08;
      currentDishY += (targetY * 10 - currentDishY) * 0.08;
      heroDish.style.transform = `translate(${currentDishX}px, ${currentDishY}px)`;
      requestAnimationFrame(animateParallax);
    }

    animateParallax();
  }

  // --- Signature Dishes Interactive Carousel ---
  const signatureDishes = [
    {
      img: 'IMAGES/ChatGPT Image Aug 30, 2026, 03_25_11 AM.webp',
      title: 'Doi Ilish',
      subtitle: 'Bengal’s Pride',
      desc: 'Fresh Hilsa cooked in rich mustard sauce with green chillies — a timeless Bengali classic.'
    },
    {
      img: 'IMAGES/ChatGPT Image Aug 25, 2026, 09_32_23 PM.webp',
      title: 'Chingri Malaikari',
      subtitle: 'Royal Feast',
      desc: 'Jumbo prawns simmered in silky coconut milk curry with whole aromatic spices.'
    },
    {
      img: 'IMAGES/ChatGPT Image Aug 25, 2026, 09_27_35 PM.webp',
      title: 'Ilish Macher Jhol',
      subtitle: 'Monsoon Specialty',
      desc: 'Fresh Hilsa cooked in light nigella seed broth with potatoes and green chillies.'
    },
    {
      img: 'IMAGES/ChatGPT Image Aug 30, 2026, 03_18_04 AM.webp',
      title: 'Ilish Kalia',
      subtitle: 'Festive Delicacy',
      desc: 'Rich, slow-cooked fish curry with caramelized onions, spices, and green chillies.'
    }
  ];

  let currentDishIdx = 0;
  const sigDishImg = document.getElementById('sigDishImg');
  const sigCounter = document.getElementById('sigCounter');
  const sigDishTitle = document.getElementById('sigDishTitle');
  const sigDishSubtitle = document.getElementById('sigDishSubtitle');
  const sigDishDesc = document.getElementById('sigDishDesc');

  const sigPrevBtn = document.getElementById('sigPrevBtn');
  const sigNextBtn = document.getElementById('sigNextBtn');

  function updateSignatureDish(index) {
    if (!sigDishImg) return;
    currentDishIdx = index;
    const item = signatureDishes[index];

    sigDishImg.style.opacity = '0';
    sigDishImg.style.transform = 'scale(0.94)';

    setTimeout(() => {
      sigDishImg.src = item.img;
      if (sigCounter) sigCounter.textContent = `0${index + 1} / 04`;
      if (sigDishTitle) sigDishTitle.textContent = item.title;
      if (sigDishSubtitle) sigDishSubtitle.textContent = item.subtitle;
      if (sigDishDesc) sigDishDesc.textContent = item.desc;

      sigDishImg.style.opacity = '1';
      sigDishImg.style.transform = 'scale(1)';
    }, 200);
  }

  if (sigPrevBtn) {
    sigPrevBtn.addEventListener('click', () => {
      let newIdx = currentDishIdx - 1;
      if (newIdx < 0) newIdx = signatureDishes.length - 1;
      updateSignatureDish(newIdx);
    });
  }

  if (sigNextBtn) {
    sigNextBtn.addEventListener('click', () => {
      let newIdx = (currentDishIdx + 1) % signatureDishes.length;
      updateSignatureDish(newIdx);
    });
  }

  if ('IntersectionObserver' in window) {
    // --- General Scroll Reveal Observer for Editorial Sections ---
    const revealElements = document.querySelectorAll('.story-step-card, .bengali-table-hero-frame, .bengali-table-editorial-card, .final-closing-media, .editorial-footer');
    revealElements.forEach(el => el.classList.add('reveal-on-scroll'));

    const scrollRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, {
      threshold: 0.02,
      rootMargin: '50px 0px 50px 0px'
    });

    revealElements.forEach(el => scrollRevealObserver.observe(el));
  }
});
