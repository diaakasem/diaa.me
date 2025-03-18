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
