const menuButton = document.querySelector('.nav-toggle');
const navigation = document.querySelector('.primary-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  const continueToDonorForm = () => {
    window.location.href = new URL('donate.html', document.baseURI).href;
  };
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    }
  });
}

const filters = document.querySelectorAll('.filter-button');
const galleryCards = document.querySelectorAll('.gallery-card');

filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const selectedCategory = filter.dataset.filter;
    filters.forEach((button) => button.setAttribute('aria-pressed', String(button === filter)));
    galleryCards.forEach((card) => {
      card.hidden = selectedCategory !== 'all' && card.dataset.category !== selectedCategory;
    });
  });
});

const photoDialog = document.querySelector('.photo-dialog');

if (photoDialog) {
  const dialogImage = photoDialog.querySelector('img');
  const dialogCaption = photoDialog.querySelector('p');

  document.querySelectorAll('.gallery-card').forEach((card) => {
    card.addEventListener('click', () => {
      const cardImage = card.querySelector('img');
      dialogImage.src = cardImage.src;
      dialogImage.alt = cardImage.alt;
      dialogCaption.textContent = card.dataset.caption;
      photoDialog.showModal();
    });
  });

  photoDialog.querySelector('.dialog-close').addEventListener('click', () => photoDialog.close());
  photoDialog.addEventListener('click', (event) => {
    if (event.target === photoDialog) photoDialog.close();
  });
}

document.querySelectorAll('[data-year]').forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const heroSlideshow = document.querySelector('[data-hero-slideshow]');

if (heroSlideshow) {
  const slides = [...heroSlideshow.querySelectorAll('.hero-slide')];
  const indicators = [...heroSlideshow.querySelectorAll('.hero-indicator')];
  const previousButton = heroSlideshow.querySelector('[data-hero-prev]');
  const nextButton = heroSlideshow.querySelector('[data-hero-next]');
  const pauseButton = heroSlideshow.querySelector('[data-hero-pause]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let autoplayTimer = null;
  let isPaused = reducedMotion.matches;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeIndex);
      indicators[slideIndex].classList.toggle('is-active', slideIndex === activeIndex);
      indicators[slideIndex].setAttribute('aria-pressed', String(slideIndex === activeIndex));
    });
  };

  const updateAutoplay = () => {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
    pauseButton.setAttribute('aria-pressed', String(isPaused));
    pauseButton.setAttribute('aria-label', isPaused ? 'Play background photos' : 'Pause background photos');
    pauseButton.title = isPaused ? 'Play background photos' : 'Pause background photos';

    if (!isPaused && !document.hidden && !reducedMotion.matches) {
      autoplayTimer = window.setInterval(() => showSlide(activeIndex + 1), 6500);
    }
  };

  previousButton.addEventListener('click', () => {
    showSlide(activeIndex - 1);
    updateAutoplay();
  });
  nextButton.addEventListener('click', () => {
    showSlide(activeIndex + 1);
    updateAutoplay();
  });
  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      showSlide(Number(indicator.dataset.heroSlideTo));
      updateAutoplay();
    });
  });
  pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    updateAutoplay();
  });
  document.addEventListener('visibilitychange', updateAutoplay);
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) isPaused = true;
    updateAutoplay();
  });
  updateAutoplay();
}

const donateTriggers = document.querySelectorAll('[data-donate-trigger]');

if (donateTriggers.length) {
  const donationDialog = document.createElement('dialog');
  donationDialog.className = 'donation-dialog';
  donationDialog.setAttribute('aria-labelledby', 'donation-dialog-title');
  donationDialog.innerHTML = `
    <button class="dialog-close" type="button" data-donation-close aria-label="Continue to donor form" title="Continue to donor form">×</button>
    <div class="donation-dialog-content">
      <p class="eyebrow eyebrow-dark">Support CSADI</p>
      <h2 id="donation-dialog-title">Bank transfer details</h2>
      <p class="account-pending">CSADI's verified account details are awaiting confirmation. Please contact the team before making a transfer.</p>
      <dl class="account-details">
        <div><dt>Bank name</dt><dd>Awaiting confirmation</dd></div>
        <div><dt>Account name</dt><dd>Awaiting confirmation</dd></div>
        <div><dt>Account number</dt><dd>Awaiting confirmation</dd></div>
      </dl>
      <p class="account-contact">For current details, email <a href="mailto:admin@csadi.org">admin@csadi.org</a> or call <a href="tel:+2348065725403">+234 806 572 5403</a>.</p>
      <button class="button button-sun donation-continue" type="button" data-donation-close>Continue to donor form <span aria-hidden="true">↗</span></button>
    </div>`;
  document.body.append(donationDialog);
  const continueToDonorForm = () => {
    window.location.href = new URL('donate.html', document.baseURI).href;
  };

  donateTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      donationDialog.showModal();
    });
  });

  donationDialog.querySelectorAll('[data-donation-close]').forEach((button) => {
    button.addEventListener('click', continueToDonorForm);
  });
  donationDialog.addEventListener('click', (event) => {
    if (event.target === donationDialog) continueToDonorForm();
  });
  donationDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    continueToDonorForm();
  });
}

const donorForm = document.querySelector('[data-donor-form]');

if (donorForm) {
  donorForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(donorForm);
    const message = [
      `Name: ${formData.get('name')}`,
      `Email: ${formData.get('email')}`,
      `Phone: ${formData.get('phone') || 'Not provided'}`,
      `Intended amount: ${formData.get('amount') || 'Not provided'}`,
      `Message: ${formData.get('message') || 'Not provided'}`
    ].join('\n');
    const mailto = `mailto:admin@csadi.org?subject=${encodeURIComponent('Donation enquiry')}&body=${encodeURIComponent(message)}`;
    window.location.href = mailto;
    donorForm.querySelector('.form-note').textContent = 'Your email app should open with your enquiry. Nothing is sent until you choose to send it.';
  });
}