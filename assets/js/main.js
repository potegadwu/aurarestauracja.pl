document.addEventListener('DOMContentLoaded', () => {
  // 1. Version Switcher Logic
  const body = document.body;
  const switchBtns = document.querySelectorAll('.switch-btn');

  function setTopVersion(version) {
    body.setAttribute('data-top-version', version);
    switchBtns.forEach(btn => {
      if (btn.getAttribute('data-version') === version) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    localStorage.setItem('aura_top_version', version);
  }

  // Load saved version or default to version 3 (wybrana przez użytkownika)
  let savedVersion = localStorage.getItem('aura_top_version');
  if (!savedVersion || savedVersion === '1') {
    savedVersion = '3';
  }
  setTopVersion(savedVersion);

  switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.getAttribute('data-version');
      setTopVersion(v);
    });
  });

  // 2. Interactive Video Hover Logic
  // Video 1: starts at 0s (poster: aerial square)
  // Video 2: starts at 1s (poster: mussels pot)
  // Video 3: starts at 19s (poster: poledwica steak)
  const videoCards = document.querySelectorAll('.video-card');

  videoCards.forEach(card => {
    const video = card.querySelector('video');
    const startTime = parseFloat(card.getAttribute('data-start') || '0');

    // Set initial video frame
    video.addEventListener('loadedmetadata', () => {
      video.currentTime = startTime;
    });

    // Desktop hover play
    card.addEventListener('mouseenter', () => {
      video.muted = true; // allow autoplay in modern browsers
      video.play().then(() => {
        card.classList.add('playing');
      }).catch(err => {
        console.log('Autoplay prevented:', err);
      });
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = startTime;
      card.classList.remove('playing');
    });

    // Touch / click toggle for mobile or click
    card.addEventListener('click', (e) => {
      // If clicking directly on card
      if (video.paused) {
        video.muted = false; // unmute on explicit user click
        video.play().then(() => {
          card.classList.add('playing');
        });
      } else {
        video.pause();
        card.classList.remove('playing');
      }
    });

    // When video ends, loop or rewind to start
    video.addEventListener('ended', () => {
      video.currentTime = startTime;
      video.play();
    });
  });

  // 3. Side Menu Drawer Logic
  const drawer = document.getElementById('sideMenuDrawer');
  const backdrop = document.getElementById('menuBackdrop');
  const openTriggers = document.querySelectorAll('.menu-open-trigger');
  const closeBtn = document.getElementById('drawerCloseBtn');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openTriggers.forEach(btn => btn.addEventListener('click', openDrawer));
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // 4. Reservation Modal Logic
  const modalBackdrop = document.getElementById('reservationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const bookBtns = document.querySelectorAll('.btn-book, .open-modal-trigger');

  function openModal(e) {
    if (e) e.preventDefault();
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  bookBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Handle ESC key to close drawer or modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
    }
  });

  // 5. Reservation Subpage Form Logic (rezerwacja.html)
  const resDateInput = document.getElementById('resDate');
  if (resDateInput) {
    // Prevent selecting dates in the past
    resDateInput.min = new Date().toISOString().split('T')[0];
  }

  const recaptchaCard = document.getElementById('recaptchaCard');
  const recaptchaCheck = document.getElementById('recaptchaCheck');
  let isRecaptchaVerified = false;

  if (recaptchaCard && recaptchaCheck) {
    function toggleRecaptcha() {
      isRecaptchaVerified = !isRecaptchaVerified;
      if (isRecaptchaVerified) {
        recaptchaCheck.classList.add('checked');
        recaptchaCard.setAttribute('aria-checked', 'true');
      } else {
        recaptchaCheck.classList.remove('checked');
        recaptchaCard.setAttribute('aria-checked', 'false');
      }
    }

    recaptchaCard.addEventListener('click', toggleRecaptcha);
    recaptchaCard.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleRecaptcha();
      }
    });
  }

  const resPageForm = document.getElementById('reservationPageForm');
  const resSuccessMessage = document.getElementById('resSuccessMessage');

  if (resPageForm) {
    resPageForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check required fields
      if (!resPageForm.checkValidity()) {
        resPageForm.reportValidity();
        return;
      }

      if (!isRecaptchaVerified) {
        alert('Prosimy o zaznaczenie pola "Nie jestem robotem".');
        if (recaptchaCard) recaptchaCard.focus();
        return;
      }

      // Hide form and show confirmation message
      resPageForm.style.display = 'none';
      if (resSuccessMessage) {
        resSuccessMessage.classList.add('active');
        resSuccessMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
});

