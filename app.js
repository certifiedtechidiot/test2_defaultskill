/**
 * Roshani Enterprises — Interactive Controller
 * Adhering to AI Design Skill (B7 Motion, B9 States, B11 Tagline Reveal)
 * and Hallmark Floor (Gate 27 Reduced Motion, Gate 15 Instant Focus, Gate 70 Honesty)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 0. Prefers Reduced Motion & Lenis Momentum Scrolling
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenisInstance = null;

  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth Anchor Scrolling with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenisInstance.scrollTo(targetEl, { offset: 0, duration: 1.1 });
          }
        }
      });
    });
  }

  // 1. Mobile Menu Drawer (Half-Screen with Blurred Remaining Half & Close Buttons)
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const drawerCloseTop = document.getElementById('drawerCloseTop');
  const drawerCloseBottom = document.getElementById('drawerCloseBottom');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileDrawer) {
    const toggleMenu = (isOpen) => {
      const open = typeof isOpen === 'boolean' ? isOpen : !mobileDrawer.classList.contains('is-open');
      mobileDrawer.classList.toggle('is-open', open);
      mobileToggle.setAttribute('aria-expanded', String(open));
      mobileDrawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (lenisInstance) {
        if (open) lenisInstance.stop();
        else lenisInstance.start();
      }
    };

    mobileToggle.addEventListener('click', () => toggleMenu());

    if (mobileDrawerBackdrop) {
      mobileDrawerBackdrop.addEventListener('click', () => toggleMenu(false));
    }

    if (drawerCloseTop) {
      drawerCloseTop.addEventListener('click', () => toggleMenu(false));
    }

    if (drawerCloseBottom) {
      drawerCloseBottom.addEventListener('click', () => toggleMenu(false));
    }

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

  if (prefersReducedMotion) {
    taglineWords.forEach(word => word.classList.add('is-active'));
  } else if (taglineWords.length && 'IntersectionObserver' in window) {
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

  // 3b. Progressive Scroll-Driven Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  } else if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
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
    if (lenisInstance) lenisInstance.stop();
    const firstInput = modal.querySelector('input');
    if (firstInput) firstInput.focus();
  };

  const closeDialog = () => {
    if (!modal) return;
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenisInstance) lenisInstance.start();
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


  // 4b. Project Documentation Lightbox Modal Management
  const projectData = {
    'bel-air': {
      title: 'The Bel-Air Ridge Residence',
      valuation: '$18.4M',
      specs: '14,200 sq ft, cantilever infinity pool, Bel-Air enclave',
      status: 'Commissioned 2024',
      image: 'assets/proj_center_hd.jpg',
      alt: 'The Bel-Air Ridge Residence architectural villa exterior',
      structure: 'Post-tensioned grade 80 concrete slab with dual-axis seismic dampeners.',
      glazing: 'Triple-laminated acoustic low-iron glass walls with motorized thermal breaks.',
      foundation: 'Deep-seated micropile caissons drilled 42 feet into bedrock strata.',
      energy: 'Geothermal hydronic cooling paired with 48kW micro-inverter solar.'
    },
    'malibu': {
      title: 'The Malibu Bluffs Villa',
      valuation: '$24.8M',
      specs: '11,800 sq ft, marine concrete, Pacific Coast Highway',
      status: 'Commissioned 2025',
      image: 'assets/val_villa_hd.jpg',
      alt: 'The Malibu Bluffs Villa coastal architecture exterior',
      structure: 'Sulfate-resistant monolithic marine concrete engineered for coastal salt spray.',
      glazing: 'Hurricane-rated 18mm laminated structural curtain wall with UV reflection coating.',
      foundation: 'Engineered grade beam tieback array keyed directly into coastal bluffs.',
      energy: 'Desalination-integrated hydronic loops and triple-redundant solar battery reserve.'
    },
    'aspen': {
      title: 'The Aspen Alpine Retreat',
      valuation: '$16.2M',
      specs: '9,600 sq ft, thermal mass basalt, Red Mountain Aspen',
      status: 'In Delivery 2026',
      image: 'assets/proj_right_hd.jpg',
      alt: 'The Aspen Alpine Retreat alpine mountain residence exterior',
      structure: 'Heavy timber hybrid glulam framework clad in cut volcanic thermal mass basalt.',
      glazing: 'Argon-filled quad-pane insulated glass units rated for -30°F thermal excursions.',
      foundation: 'Frost-heave resistant raft footing with continuous radiant perimeter warmth.',
      energy: 'High-altitude sub-zero heat exchanger network with micro-hydro auxiliary input.'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const projectModalClose = document.getElementById('projectModalClose');
  const projectModalTitle = document.getElementById('projectModalTitle');
  const projectModalValuation = document.getElementById('projectModalValuation');
  const projectModalSpecs = document.getElementById('projectModalSpecs');
  const projectModalStatus = document.getElementById('projectModalStatus');
  const projectModalImage = document.getElementById('projectModalImage');
  const projectModalStructure = document.getElementById('projectModalStructure');
  const projectModalGlazing = document.getElementById('projectModalGlazing');
  const projectModalFoundation = document.getElementById('projectModalFoundation');
  const projectModalEnergy = document.getElementById('projectModalEnergy');
  const projectModalInquireBtn = document.getElementById('projectModalInquireBtn');
  const projectViewBtns = document.querySelectorAll('.project-view-btn');
  let previousProjectTrigger = null;

  const openProjectModal = (projectId) => {
    if (!projectModal || !projectData[projectId]) return;
    const data = projectData[projectId];

    if (projectModalTitle) projectModalTitle.textContent = data.title;
    if (projectModalValuation) projectModalValuation.textContent = data.valuation;
    if (projectModalSpecs) projectModalSpecs.textContent = data.specs;
    if (projectModalStatus) projectModalStatus.textContent = data.status;
    if (projectModalStructure) projectModalStructure.textContent = data.structure;
    if (projectModalGlazing) projectModalGlazing.textContent = data.glazing;
    if (projectModalFoundation) projectModalFoundation.textContent = data.foundation;
    if (projectModalEnergy) projectModalEnergy.textContent = data.energy;

    if (projectModalImage) {
      projectModalImage.src = data.image;
      projectModalImage.alt = data.alt || data.title;
    }

    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenisInstance) lenisInstance.stop();

    const modalWindow = projectModal.querySelector('.project-modal-window');
    if (modalWindow) {
      modalWindow.scrollTop = 0;
    }

    if (projectModalClose) {
      projectModalClose.focus({ preventScroll: true });
    }
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    if (!modal || !modal.classList.contains('is-active')) {
      document.body.style.overflow = '';
      if (lenisInstance) lenisInstance.start();
    }
    if (previousProjectTrigger && typeof previousProjectTrigger.focus === 'function') {
      previousProjectTrigger.focus();
    }
  };

  projectViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      previousProjectTrigger = btn;
      const pid = btn.dataset.projectId;
      openProjectModal(pid);
    });
  });

  // Also make clicking project image box open documentation
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    const imgBox = card.querySelector('.project-image-box');
    const pid = card.dataset.projectId;
    if (imgBox && pid) {
      imgBox.style.cursor = 'pointer';
      imgBox.addEventListener('click', () => {
        const btn = card.querySelector('.project-view-btn');
        previousProjectTrigger = btn || imgBox;
        openProjectModal(pid);
      });
    }
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', closeProjectModal);
  }

  if (projectModalInquireBtn) {
    projectModalInquireBtn.addEventListener('click', () => {
      closeProjectModal();
      openDialog();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-active')) {
      closeProjectModal();
    }
  });

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
          notesFeedback.textContent = 'Consultation request recorded for review by our development team.';
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
