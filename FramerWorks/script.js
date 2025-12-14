document.addEventListener('DOMContentLoaded', () => {
      const dl = document.querySelector('#download .btn-primary');
      const getStarted = document.querySelector('.hero .btn-primary');
      const exampleSection = document.getElementById('examples');
      const banner = document.getElementById('error-banner');

      if (dl) {
        dl.addEventListener('click', (e) => {
          e.preventDefault();
          banner.style.display = 'block';
          setTimeout(() => { banner.style.display = 'none'; }, 4000);
        });
      }

      if (getStarted && exampleSection) {
        getStarted.addEventListener('click', (e) => {
          e.preventDefault();
          exampleSection.scrollIntoView({ behavior: 'smooth' });
        });
      }

      // Smooth scroll for header nav links
      const navLinks = document.querySelectorAll('nav a[data-target]');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(link.getAttribute('data-target'));
          if(target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    });