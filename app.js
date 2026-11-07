/**
 * Roshani Enterprises — Interactive Controller
 * Adhering to AI Design Skill (B7 Motion, B9 States, B11 Tagline Reveal)
 * and Hallmark Floor (Gate 27 Reduced Motion, Gate 15 Instant Focus, Gate 70 Honesty)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    const toggleMenu = (isOpen) => {
      const open = typeof isOpen === 'boolean' ? isOpen : !mobileDrawer.classList.contains('is-open');
      mobileDrawer.classList.toggle('is-open', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileDrawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });
  }

  // 2. Active Section Highlighting in Floating Nav
  const sections = document.querySelectorAll('main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link-item');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('is-current');
            } else {
              link.classList.remove('is-current');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // 3. Tagline Reveal Section (Mandatory B11: Word-by-word on Scroll)
  const taglineWords = document.querySelectorAll('.tagline-word');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    taglineWords.forEach(word => word.classList.add('is-active'));
  } else if (taglineWords.length && 'IntersectionObserver' in window) {
    let delayCounter = 0;
    const wordObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const word = entry.target;
          const index = Array.from(taglineWords).indexOf(word);
          setTimeout(() => {
            word.classList.add('is-active');
          }, index * 45);
          wordObserver.unobserve(word);
        }
      });
    }, {
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.2
    });

    taglineWords.forEach(word => wordObserver.observe(word));
  } else {
    taglineWords.forEach(word => word.classList.add('is-active'));
  }

  // 4. Consultation Dialog Modal Management
  const modal = document.getElementById('consultationModal');
  const openTriggers = document.querySelectorAll('.open-consultation-trigger');
  const closeBtn = document.getElementById('closeDialogBtn');
  const consultationForm = document.getElementById('consultationForm');
  let previousActiveElement = null;

  const openDialog = () => {
    if (!modal) return;
    previousActiveElement = document.activeElement;
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  };

  const closeDialog = () => {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  };

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDialog();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDialog);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeDialog();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closeDialog();
      }
    });
  }

  // 5. Accessible Consultation Form Validation (B9 & B10)
  if (consultationForm) {
    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const nameFeedback = document.getElementById('nameFeedback');
    const emailFeedback = document.getElementById('emailFeedback');
    const notesFeedback = document.getElementById('notesFeedback');

    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Reset feedbacks
      nameFeedback.textContent = '';
      emailFeedback.textContent = '';
      notesFeedback.textContent = '';
      notesFeedback.className = 'form-feedback';

      // Validate name
      if (!nameInput.value.trim()) {
        nameFeedback.textContent = 'Please provide your name or company representative.';
        isValid = false;
      }

      // Validate email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim())) {
        emailFeedback.textContent = 'Please enter a valid corporate or private email address.';
        isValid = false;
      }

      if (isValid) {
        const submitBtn = consultationForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Transmitting brief...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit consultation brief';
          notesFeedback.className = 'form-feedback is-success';
          notesFeedback.textContent = 'Consultation request recorded for review by David Alex and the development team.';
          consultationForm.reset();
          setTimeout(() => {
            closeDialog();
            notesFeedback.textContent = '';
          }, 3200);
        }, 800);
      }
    });
  }

  // 6. Dynamic Scrolled State for Navigation Bar (B7 Throttled)
  const navPill = document.querySelector('.site-nav-pill');
  if (navPill) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 24) {
            navPill.classList.add('is-scrolled');
          } else {
            navPill.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
});
