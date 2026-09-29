/* ═══════════════════════════════════════════════════════════
   THE 618 CIRCLE — INTERACTIVE SCRIPTS
   Navigation, scroll animations, mobile menu, smooth interactions
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── NAV SCROLL BEHAVIOUR ───
  const nav = document.getElementById('main-nav');
  let lastScroll = 0;

  const handleNavScroll = () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ─── MOBILE MENU ───
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── SCROLL ANIMATIONS (Intersection Observer) ───
  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const parent = entry.target.parentElement;
        const siblings = parent ? [...parent.querySelectorAll('.animate-on-scroll')] : [];
        const siblingIndex = siblings.indexOf(entry.target);
        const delay = siblingIndex >= 0 ? siblingIndex * 80 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        animateOnScroll.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animateOnScroll.observe(el);
  });

  // ─── SMOOTH SCROLL FOR NAV LINKS ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ─── ACTIVE NAV LINK HIGHLIGHT ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const highlightNavLink = () => {
    const scrollPos = window.scrollY + 200;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ─── PARALLAX SUBTLE EFFECT ON HERO GRID ───
  const heroGrid = document.querySelector('.hero__grid-lines');
  if (heroGrid) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroGrid.style.transform = `translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }

  // ─── COUNTER ANIMATION FOR FOUNDING NUMBERS ───
  const foundingSection = document.getElementById('founding');
  if (foundingSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(foundingSection);
  }

  function animateCounter() {
    const fromEl = document.querySelector('.founding__from');
    const toEl = document.querySelector('.founding__to');
    
    if (!fromEl || !toEl) return;

    // Animate "0001"
    animateNumber(fromEl, 0, 1, 1200, val => String(val).padStart(4, '0'));
    // Animate "0618"
    setTimeout(() => {
      animateNumber(toEl, 0, 618, 1800, val => String(val).padStart(4, '0'));
    }, 400);
  }

  function animateNumber(element, start, end, duration, format) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (end - start) * eased);
      
      element.textContent = format(value);
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    
    requestAnimationFrame(update);
  }

  // ─── GOLD GLOW ON HERO LOGO (subtle mouse interaction) ───
  const heroLogo = document.querySelector('.hero__logo-img');
  if (heroLogo) {
    document.addEventListener('mousemove', (e) => {
      const rect = heroLogo.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = (e.clientX - centerX) / window.innerWidth;
      const distY = (e.clientY - centerY) / window.innerHeight;
      
      const glowIntensity = Math.max(0, 0.15 - Math.sqrt(distX * distX + distY * distY) * 0.3);
      heroLogo.style.filter = `drop-shadow(0 0 ${40 + glowIntensity * 60}px rgba(201, 168, 76, ${0.08 + glowIntensity}))`;
    });
  }
});
