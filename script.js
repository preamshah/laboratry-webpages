const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const backTop = document.querySelector('.back-top');
const form = document.getElementById('whatsappForm');
const testType = document.getElementById('testType');

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

window.addEventListener('scroll', () => {
  if (window.scrollY > 650) backTop.classList.add('show');
  else backTop.classList.remove('show');
});

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelectorAll('.faq-item button').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('button').setAttribute('aria-expanded', 'false');
    });
    if (!wasActive) {
      item.classList.add('active');
      button.setAttribute('aria-expanded', 'true');
    }
  });
});

function setSelectedTest(value) {
  if (!value || !testType) return;
  const existing = [...testType.options].find(opt => opt.text.toLowerCase() === value.toLowerCase());
  if (existing) {
    testType.value = existing.value;
  } else {
    let other = [...testType.options].find(opt => opt.value === 'Other / Not sure');
    if (other) testType.value = other.value;
    const message = document.getElementById('message');
    if (message && !message.value) message.value = `I would like to ask about: ${value}`;
  }
}

document.querySelectorAll('[data-test]').forEach(el => {
  el.addEventListener('click', () => {
    setSelectedTest(el.dataset.test);
    setTimeout(() => document.getElementById('name')?.focus({ preventScroll: true }), 500);
  });
});

const today = new Date();
const dateInput = document.getElementById('date');
if (dateInput) {
  const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  dateInput.min = local;
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const test = testType.value;
  const date = document.getElementById('date').value || 'Not specified';
  const time = document.getElementById('time').value;
  const note = document.getElementById('message').value.trim() || 'Please share availability, preparation requirements, price and expected report time.';

  const text = [
    'Hello Mahi Pathology Lab,',
    '',
    'I would like to enquire about a lab test.',
    `Name: ${name}`,
    `Contact: ${phone}`,
    `Test / enquiry: ${test}`,
    `Preferred date: ${date}`,
    `Preferred time: ${time}`,
    `Message: ${note}`,
    '',
    'Please let me know the availability and any preparation required. Thank you.'
  ].join('\n');

  const url = `https://wa.me/9779809698988?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});

document.getElementById('year').textContent = new Date().getFullYear();
