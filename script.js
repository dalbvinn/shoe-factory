/**
 * SoleCraft Footwear Factory - Official Interactive Controller (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* =========================================================================
     1. Mobile Navigation & Header Scroll State
     ========================================================================= */
  const navToggleBtn = document.getElementById('nav-toggle-btn');
  const primaryNavbar = document.getElementById('primary-navbar');
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggleBtn && primaryNavbar) {
    navToggleBtn.addEventListener('click', () => {
      const isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      navToggleBtn.setAttribute('aria-expanded', String(!isExpanded));
      primaryNavbar.classList.toggle('open');
    });

    // Close mobile nav when clicking a nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (primaryNavbar.classList.contains('open')) {
          primaryNavbar.classList.remove('open');
          navToggleBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Header elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  /* =========================================================================
     2. Interactive 3D Shoe Configurator & Visualizer
     ========================================================================= */
  // SVG Layer Elements
  const stageUpper = document.getElementById('stage-upper');
  const stageHeelCounter = document.getElementById('stage-heel-counter');
  const stageToeCap = document.getElementById('stage-toe-cap');
  const stageSole = document.getElementById('stage-sole');
  const stageHeel = document.getElementById('stage-heel');
  const stageLaces = document.getElementById('stage-laces');
  const stageMonogramText = document.getElementById('stage-monogram-text');
  const stageSheen = document.getElementById('stage-sheen');
  const shoeSvgModel = document.getElementById('interactive-shoe-svg');

  // HUD and Summary Elements
  const activeModelDisplay = document.getElementById('active-model-display');
  const activeMaterialDisplay = document.getElementById('active-material-display');
  const viewAngleDisplay = document.getElementById('view-angle-display');
  const calcPrice = document.getElementById('calc-price');
  const calcLeadtime = document.getElementById('calc-leadtime');
  const calcSpecId = document.getElementById('calc-spec-id');
  const customizerAlert = document.getElementById('customizer-alert');

  // Input & Control Elements
  const silhouetteButtons = document.querySelectorAll('[data-silhouette]');
  const swatchButtons = document.querySelectorAll('[data-upper-color]');
  const soleButtons = document.querySelectorAll('[data-sole-color]');
  const laceButtons = document.querySelectorAll('[data-lace-color]');
  const monogramInput = document.getElementById('monogram-input');

  // Toolbar Buttons
  const btnRotateLeft = document.getElementById('btn-rotate-left');
  const btnResetView = document.getElementById('btn-reset-view');
  const btnToggleSheen = document.getElementById('btn-toggle-sheen');
  const btnSaveConfig = document.getElementById('btn-save-config');
  const btnDownloadSpec = document.getElementById('btn-download-spec');

  // Current State
  const configState = {
    silhouette: 'oxford',
    silhouetteName: 'Heritage Oxford',
    basePrice: 220,
    colorName: 'Cognac Tuscan',
    upperColor: '#b86b35',
    accentColor: '#78350f',
    soleName: 'Goodyear Leather',
    soleColor: '#8a5323',
    heelColor: '#4a2511',
    laceColor: '#f8fafc',
    monogram: 'SC',
    isGlossy: true,
    rotationDeg: 0
  };

  // Function: Update Price & Spec ID
  function updateSummary() {
    const finalPrice = configState.basePrice;
    if (calcPrice) calcPrice.textContent = `$${finalPrice} USD`;
    if (calcLeadtime) calcLeadtime.textContent = configState.silhouette === 'runner' ? '10 Business Days' : '14 Business Days';
    
    const hexClean = configState.upperColor.replace('#', '').toUpperCase();
    const silCode = configState.silhouette.substring(0, 2).toUpperCase();
    if (calcSpecId) calcSpecId.textContent = `SC-${silCode}-2026-${hexClean}`;
  }

  // 1. Silhouette Selection
  silhouetteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      silhouetteButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      configState.silhouette = btn.getAttribute('data-silhouette');
      configState.silhouetteName = btn.getAttribute('data-name');
      configState.basePrice = parseInt(btn.getAttribute('data-price'), 10) || 200;

      if (activeModelDisplay) {
        activeModelDisplay.textContent = `Model: ${configState.silhouetteName}`;
      }

      // Visual feedback: slight animate pulse
      if (shoeSvgModel) {
        shoeSvgModel.style.transform = 'scale(0.96)';
        setTimeout(() => {
          shoeSvgModel.style.transform = `scale(1) rotate(${configState.rotationDeg}deg)`;
        }, 120);
      }

      updateSummary();
    });
  });

  // 2. Leather & Color Swatches
  swatchButtons.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatchButtons.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-checked', 'false');
      });
      swatch.classList.add('active');
      swatch.setAttribute('aria-checked', 'true');

      configState.upperColor = swatch.getAttribute('data-upper-color');
      configState.accentColor = swatch.getAttribute('data-accent-color');
      configState.colorName = swatch.getAttribute('data-color-name');

      if (stageUpper) stageUpper.setAttribute('fill', configState.upperColor);
      if (stageHeelCounter) stageHeelCounter.setAttribute('fill', configState.accentColor);
      if (stageToeCap) stageToeCap.setAttribute('fill', configState.accentColor);

      if (activeMaterialDisplay) {
        activeMaterialDisplay.textContent = `Leather: ${configState.colorName}`;
      }

      updateSummary();
    });
  });

  // 3. Outsole Construction
  soleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      soleButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      configState.soleColor = btn.getAttribute('data-sole-color');
      configState.heelColor = btn.getAttribute('data-heel-color');
      configState.soleName = btn.getAttribute('data-sole-name');

      if (stageSole) stageSole.setAttribute('fill', configState.soleColor);
      if (stageHeel) stageHeel.setAttribute('fill', configState.heelColor);

      updateSummary();
    });
  });

  // 4. Laces Color
  laceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      laceButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      configState.laceColor = btn.getAttribute('data-lace-color');
      if (stageLaces) {
        stageLaces.setAttribute('stroke', configState.laceColor);
      }
    });
  });

  // 5. Monogram Live Text Update
  if (monogramInput && stageMonogramText) {
    monogramInput.addEventListener('input', (e) => {
      const val = e.target.value.toUpperCase().slice(0, 3);
      e.target.value = val;
      stageMonogramText.textContent = val || '--';
      configState.monogram = val;
    });
  }

  // 6. Rotate & View Angles
  if (btnRotateLeft && shoeSvgModel) {
    btnRotateLeft.addEventListener('click', () => {
      configState.rotationDeg = (configState.rotationDeg - 10) % 360;
      shoeSvgModel.style.transform = `rotate(${configState.rotationDeg}deg)`;
      if (viewAngleDisplay) {
        viewAngleDisplay.textContent = `Angle: ${configState.rotationDeg}&deg;`;
      }
    });
  }

  if (btnResetView && shoeSvgModel) {
    btnResetView.addEventListener('click', () => {
      configState.rotationDeg = 0;
      shoeSvgModel.style.transform = 'rotate(0deg) scale(1)';
      if (viewAngleDisplay) {
        viewAngleDisplay.textContent = 'View: Lateral Profile';
      }
    });
  }

  // 7. Gloss Finish Toggle
  if (btnToggleSheen && stageSheen) {
    btnToggleSheen.addEventListener('click', () => {
      configState.isGlossy = !configState.isGlossy;
      stageSheen.style.opacity = configState.isGlossy ? '0.18' : '0.02';
      btnToggleSheen.innerHTML = configState.isGlossy 
        ? '<span aria-hidden="true">&#10024;</span> Finish: Gloss' 
        : '<span aria-hidden="true">&#9675;</span> Finish: Matte';
    });
  }

  // 8. Customizer Actions
  if (btnSaveConfig && customizerAlert) {
    btnSaveConfig.addEventListener('click', () => {
      customizerAlert.className = 'customizer-alert show success';
      customizerAlert.textContent = `Configuration locked for ${configState.silhouetteName} in ${configState.colorName} with monogram "${configState.monogram}". Sample ticket generated!`;
      
      // Auto-scroll to contact form and populate message
      const inquirySelect = document.getElementById('contact-inquiry-type');
      const messageField = document.getElementById('contact-message');
      if (inquirySelect) inquirySelect.value = 'customizer';
      if (messageField) {
        messageField.value = `Customizer Sample Request:\n- Model: ${configState.silhouetteName}\n- Leather: ${configState.colorName} (${configState.upperColor})\n- Outsole: ${configState.soleName}\n- Heel Monogram: "${configState.monogram}"\n- Finish: ${configState.isGlossy ? 'Glossy Burnished' : 'Matte Natural'}\n- Estimated Price: $${configState.basePrice} USD`;
      }

      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 900);
    });
  }

  if (btnDownloadSpec) {
    btnDownloadSpec.addEventListener('click', () => {
      alert(`Exporting Technical Specification Sheet:\nModel: ${configState.silhouetteName}\nSpec ID: ${calcSpecId.textContent}\nMaterial: ${configState.colorName}\nOutsole: ${configState.soleName}\nInspection Status: Ready for Prototype`);
    });
  }

  /* =========================================================================
     3. Factory RFQ Contact Form Handling & Validation
     ========================================================================= */
  const contactForm = document.getElementById('factory-contact-form');
  const formFeedback = document.getElementById('form-feedback-message');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const inquiryInput = document.getElementById('contact-inquiry-type');
      const messageInput = document.getElementById('contact-message');
      const consentInput = document.getElementById('contact-consent');

      // Clear previous error states
      document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
      formFeedback.className = 'form-feedback';
      formFeedback.style.display = 'none';

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        document.getElementById('name-error').textContent = 'Please provide your full name.';
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        document.getElementById('email-error').textContent = 'Please enter a valid corporate email address.';
        isValid = false;
      }

      // Validate Inquiry Type
      if (!inquiryInput.value) {
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        document.getElementById('message-error').textContent = 'Please outline your manufacturing inquiry.';
        isValid = false;
      }

      // Validate Consent Checkbox
      if (!consentInput.checked) {
        isValid = false;
      }

      if (isValid) {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${nameInput.value.trim()}! Your factory inquiry has been logged. An engineering lead will review your specifications within 24 hours.`;
        contactForm.reset();
      } else {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please ensure all required fields are accurately completed.';
      }
    });
  }

  /* =========================================================================
     4. Newsletter Subscription Form
     ========================================================================= */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterStatus = document.getElementById('newsletter-status');

  if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value.trim();

      if (email && email.includes('@')) {
        newsletterStatus.style.color = '#4ade80';
        newsletterStatus.textContent = 'Subscribed to Factory Quarterly!';
        newsletterForm.reset();
      } else {
        newsletterStatus.style.color = '#f87171';
        newsletterStatus.textContent = 'Please enter a valid email address.';
      }
    });
  }
});
