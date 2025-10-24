/**
 * ART EUction - Animations Module
 * Handles scroll animations, fade-ins, and interactive effects
 */

/**
 * Initialize all animations
 */
export function initAnimations() {
  setupScrollAnimations();
  setupCounterAnimations();
  setupParallax();
  checkReducedMotion();
}

/**
 * Check if user prefers reduced motion
 */
let prefersReducedMotion = false;

function checkReducedMotion() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion = mediaQuery.matches;

  mediaQuery.addEventListener('change', (e) => {
    prefersReducedMotion = e.matches;
  });
}

/**
 * Setup scroll-triggered animations
 */
function setupScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.card, .section-header, .hero, .grid > *, .timeline-item, .team-member'
  );

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Skip animations if reduced motion is preferred or not supported
    animatedElements.forEach(el => el.style.opacity = '1');
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Add delay based on element index for stagger effect
        setTimeout(() => {
          entry.target.classList.add('fade-in');
        }, index * 50);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

/**
 * Setup counter animations for stats
 */
function setupCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');

  if (counters.length === 0 || prefersReducedMotion) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

/**
 * Animate a counter element
 */
function animateCounter(element) {
  const target = parseInt(element.dataset.counter);
  const duration = 2000; // 2 seconds
  const step = target / (duration / 16); // 60fps
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current));
    }
  }, 16);
}

/**
 * Format number with commas
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Setup parallax scrolling effects
 */
function setupParallax() {
  if (prefersReducedMotion) return;

  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      const offset = scrolled * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  });
}

/**
 * Animate element entrance
 */
export function animateIn(element, animation = 'fade-in', delay = 0) {
  if (prefersReducedMotion) {
    element.style.opacity = '1';
    return;
  }

  setTimeout(() => {
    element.classList.add(animation);
  }, delay);
}

/**
 * Stagger animation for multiple elements
 */
export function staggerAnimation(elements, animation = 'fade-in', delayBetween = 100) {
  if (prefersReducedMotion) {
    elements.forEach(el => el.style.opacity = '1');
    return;
  }

  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add(animation);
    }, index * delayBetween);
  });
}

/**
 * Smooth reveal for sections
 */
export function revealSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const elements = section.querySelectorAll('.card, .grid > *, h2, h3, p');
  staggerAnimation(elements);
}

/**
 * Ripple effect on click
 */
export function setupRippleEffect() {
  const buttons = document.querySelectorAll('.btn, .card, .sdg-card');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (prefersReducedMotion) return;

      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/**
 * Loading animation
 */
export function showLoading(container) {
  const loader = document.createElement('div');
  loader.className = 'loading-container';
  loader.innerHTML = '<div class="loading"></div>';
  container.appendChild(loader);
  return loader;
}

export function hideLoading(loader) {
  if (loader && loader.parentNode) {
    loader.remove();
  }
}

/**
 * Fade out element
 */
export function fadeOut(element, callback) {
  if (prefersReducedMotion) {
    element.style.display = 'none';
    if (callback) callback();
    return;
  }

  element.style.transition = 'opacity 0.3s ease';
  element.style.opacity = '0';

  setTimeout(() => {
    element.style.display = 'none';
    if (callback) callback();
  }, 300);
}

/**
 * Fade in element
 */
export function fadeIn(element) {
  if (prefersReducedMotion) {
    element.style.display = 'block';
    element.style.opacity = '1';
    return;
  }

  element.style.display = 'block';
  element.style.opacity = '0';
  element.style.transition = 'opacity 0.3s ease';

  setTimeout(() => {
    element.style.opacity = '1';
  }, 10);
}

/**
 * Slide down animation
 */
export function slideDown(element, duration = 300) {
  if (prefersReducedMotion) {
    element.style.display = 'block';
    return;
  }

  element.style.display = 'block';
  const height = element.scrollHeight;
  element.style.height = '0';
  element.style.overflow = 'hidden';
  element.style.transition = `height ${duration}ms ease`;

  setTimeout(() => {
    element.style.height = height + 'px';
  }, 10);

  setTimeout(() => {
    element.style.height = '';
    element.style.overflow = '';
  }, duration);
}

/**
 * Slide up animation
 */
export function slideUp(element, duration = 300) {
  if (prefersReducedMotion) {
    element.style.display = 'none';
    return;
  }

  const height = element.scrollHeight;
  element.style.height = height + 'px';
  element.style.overflow = 'hidden';
  element.style.transition = `height ${duration}ms ease`;

  setTimeout(() => {
    element.style.height = '0';
  }, 10);

  setTimeout(() => {
    element.style.display = 'none';
    element.style.height = '';
    element.style.overflow = '';
  }, duration);
}

/**
 * Progress bar animation
 */
export function animateProgressBar(element, targetPercent, duration = 1000) {
  if (prefersReducedMotion) {
    element.style.width = targetPercent + '%';
    return;
  }

  element.style.width = '0%';
  element.style.transition = `width ${duration}ms ease-out`;

  setTimeout(() => {
    element.style.width = targetPercent + '%';
  }, 10);
}

/**
 * Typewriter effect
 */
export function typewriter(element, text, speed = 50) {
  if (prefersReducedMotion) {
    element.textContent = text;
    return;
  }

  element.textContent = '';
  let i = 0;

  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

/**
 * Shake animation (for errors)
 */
export function shake(element) {
  if (prefersReducedMotion) return;

  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
  }, 500);
}

// Add shake keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
    20%, 40%, 60%, 80% { transform: translateX(10px); }
  }
  .shake {
    animation: shake 0.5s ease;
  }
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: scale(0);
    animation: rippleEffect 0.6s ease-out;
    pointer-events: none;
  }
  @keyframes rippleEffect {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }
`;
document.head.appendChild(style);
