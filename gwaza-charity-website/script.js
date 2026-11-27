(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  document.querySelectorAll('.nav-link, .nav-donate').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.dot')];
  const previousButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');
  if (slides.length > 1 && previousButton && nextButton) {
    let current = 0;
    let timer;
    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }
    function restartTimer() {
      clearInterval(timer);
      timer = setInterval(() => showSlide(current + 1), 6000);
    }
    previousButton.addEventListener('click', () => { showSlide(current - 1); restartTimer(); });
    nextButton.addEventListener('click', () => { showSlide(current + 1); restartTimer(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restartTimer(); }));
    restartTimer();
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      const feedback = form.querySelector('.form-feedback');
      if (!form.reportValidity()) return;
      feedback.textContent = 'Your message was not sent by this demo form. Please email or call us directly using the contact details on this page.';
      form.reset();
    });
  }

  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    const amountInput = document.getElementById('donationAmount');
    const amountOptions = [...donationForm.querySelectorAll('.amount-option')];
    const phoneField = document.getElementById('mobileMoneyPhoneField');
    const phoneInput = document.getElementById('donorPhone');
    const feedback = document.getElementById('donationFeedback');
    const submitButton = donationForm.querySelector('button[type="submit"]');

    function updatePaymentFields() {
      const method = donationForm.querySelector('input[name="method"]:checked').value;
      const needsPhone = method !== 'card';
      phoneField.hidden = !needsPhone;
      phoneInput.required = needsPhone;
      phoneInput.disabled = !needsPhone;
    }

    amountOptions.forEach(option => {
      option.addEventListener('click', () => {
        amountInput.value = option.dataset.amount;
        amountOptions.forEach(item => item.setAttribute('aria-pressed', String(item === option)));
      });
    });

    amountInput.addEventListener('input', () => {
      amountOptions.forEach(option => option.setAttribute('aria-pressed', String(option.dataset.amount === amountInput.value)));
    });

    donationForm.querySelectorAll('input[name="method"]').forEach(input => {
      input.addEventListener('change', updatePaymentFields);
    });
    updatePaymentFields();

    donationForm.addEventListener('submit', async event => {
      event.preventDefault();
      feedback.textContent = '';
      if (!donationForm.reportValidity()) return;

      const endpoint = donationForm.dataset.checkoutEndpoint.trim();
      if (!endpoint) {
        feedback.textContent = 'Online payments are not connected yet. Please call 0759 994474 or email GWAZA for verified donation instructions.';
        return;
      }

      const formData = new FormData(donationForm);
      const donation = {
        amount: Number(formData.get('amount')),
        currency: 'UGX',
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        method: formData.get('method'),
        phone: formData.get('phone')
      };

      submitButton.disabled = true;
      submitButton.textContent = 'Connecting securely…';
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(donation)
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || 'The payment could not be started.');
        }

        if (result.checkoutUrl) {
          const checkoutUrl = new URL(result.checkoutUrl, window.location.href);
          if (checkoutUrl.protocol !== 'https:') {
            throw new Error('The payment provider returned an insecure checkout link.');
          }
          window.location.assign(checkoutUrl.href);
          return;
        }

        if (result.status === 'pending' && result.message) {
          feedback.textContent = result.message;
          return;
        }

        throw new Error('The payment service returned an unexpected response.');
      } catch (error) {
        feedback.textContent = error.message || 'We could not connect to the payment service. Please contact GWAZA for help.';
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Continue to payment <span aria-hidden="true">→</span>';
      }
    });
  }
})();
