// ── Scroll-triggered fade-in ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children within the same parent
      const siblings = entry.target.parentElement.querySelectorAll('.observe-fade:not(.visible)');
      siblings.forEach((el, idx) => {
        if (el === entry.target) {
          setTimeout(() => el.classList.add('visible'), idx * 80);
        }
      });
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.observe-fade').forEach(el => observer.observe(el));


// ── Form handler ──
function handleForm(formId, btnId, successId) {
  const form = document.getElementById(formId);
  const btn  = document.getElementById(btnId);
  const msg  = document.getElementById(successId);
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    // Basic validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailInput.style.borderColor = '#F87171';
      emailInput.setAttribute('aria-invalid', 'true');
      emailInput.focus();
      setTimeout(() => {
        emailInput.style.borderColor = '';
        emailInput.removeAttribute('aria-invalid');
      }, 2000);
      return;
    }

    // Loading state
    btn.disabled = true;
    btn.textContent = 'Sending…';
    btn.classList.remove('btn-pulse');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Network response was not ok');

      form.style.display = 'none';
      msg.style.display = 'block';
    } catch (err) {
      btn.disabled = false;
      btn.textContent = btn.id === 'hero-btn' ? 'Get the Free Guide' : 'Download the Free Guide';
      emailInput.style.borderColor = '#F87171';
      console.error('Kit subscribe error:', err);
    }
  });
}

handleForm('hero-form',  'hero-btn',  'hero-success');
handleForm('final-form', 'final-btn', 'final-success');

// ── Smooth nav link behavior ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = 80;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
      target.focus({ preventScroll: true });
    }
  });
});
