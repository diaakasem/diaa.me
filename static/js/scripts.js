// Minimal Modern JavaScript for Static Site

// Scroll to Top Functionality
document.addEventListener('DOMContentLoaded', () => {
  const scrollTopButton = document.getElementById('scrolltop');
  
  if (scrollTopButton) {
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
      scrollTopButton.style.display = 
        window.scrollY > 300 ? 'block' : 'none';
    });

    // Smooth scroll to top
    scrollTopButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Simple mobile menu toggle (if needed)
  const menuTrigger = document.getElementById('menutrigger');
  const mobileMenu = document.getElementById('sidr');
  
  if (menuTrigger && mobileMenu) {
    menuTrigger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }

  // Interactive 3D hero card (name + role)
  const heroCard = document.getElementById('hero3d-card');
  const heroSection = document.getElementById('home');

  if (heroCard && heroSection) {
    const maxRotateX = 10; // degrees
    const maxRotateY = 14;
    const maxTranslateY = 10; // px parallax on scroll
    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentTranslateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetTranslateY = 0;
    let animationFrameId = null;

    function updateTransform() {
      const stiffness = 0.08;
      const damping = 0.8;

      const dx = targetRotateX - currentRotateX;
      const dy = targetRotateY - currentRotateY;
      const dt = targetTranslateY - currentTranslateY;

      currentRotateX += dx * stiffness;
      currentRotateY += dy * stiffness;
      currentTranslateY += dt * stiffness;

      heroCard.style.transform =
        `translateY(${currentTranslateY}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;

      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01 || Math.abs(dt) > 0.1) {
        animationFrameId = requestAnimationFrame(updateTransform);
      } else {
        animationFrameId = null;
      }
    }

    function setTarget(rotateX, rotateY, translateY) {
      targetRotateX = rotateX;
      targetRotateY = rotateY;
      targetTranslateY = translateY;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateTransform);
      }
    }

    function handlePointerMove(event) {
      const rect = heroCard.getBoundingClientRect();

      const pointerType = event.pointerType || 'mouse';
      const isTouchPointer = pointerType === 'touch' || pointerType === 'pen';

      if (isTouchPointer) {
        setTarget(0, 0, targetTranslateY);
        heroCard.classList.remove('hero3d-card--active');
        return;
      }

      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const dx = event.clientX - cardCenterX;
      const dy = event.clientY - cardCenterY;

      const percentX = Math.max(-1, Math.min(1, dx / (rect.width / 2)));
      const percentY = Math.max(-1, Math.min(1, dy / (rect.height / 2)));

      const rotateY = maxRotateY * percentX;
      const rotateX = -maxRotateX * percentY;

      heroCard.classList.add('hero3d-card--active');
      setTarget(rotateX, rotateY, targetTranslateY);
    }

    function handlePointerLeave() {
      heroCard.classList.remove('hero3d-card--active');
      setTarget(0, 0, targetTranslateY);
    }

    function handleScroll() {
      const rect = heroSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      const centerOffset = (rect.top + rect.height / 2) - viewportHeight / 2;
      const normalized = Math.max(-1, Math.min(1, centerOffset / viewportHeight));

      const translateY = -normalized * maxTranslateY;
      setTarget(targetRotateX, targetRotateY, translateY);
    }

    const supportsPointerEvents = 'onpointermove' in window;

    if (supportsPointerEvents) {
      window.addEventListener('pointermove', handlePointerMove);
      heroCard.addEventListener('pointerleave', handlePointerLeave);
    } else {
      window.addEventListener('mousemove', handlePointerMove);
      heroCard.addEventListener('mouseleave', handlePointerLeave);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial parallax position
    handleScroll();
  }
});

// Responsive image handling
function responsiveImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
  });
}

// Run on load and window resize
window.addEventListener('load', responsiveImages);
window.addEventListener('resize', responsiveImages);
