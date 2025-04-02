document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Promotions Slider
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    const sliderDots = document.querySelectorAll('.slider-dots .dot');
    const promotionCards = document.querySelectorAll('.promotion-card');
    
    let currentSlide = 0;
    
    function showSlide(index) {
        // Hide all slides
        promotionCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Remove active class from all dots
        sliderDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide and activate corresponding dot
        if (promotionCards[index]) {
            promotionCards[index].style.display = 'block';
        }
        
        if (sliderDots[index]) {
            sliderDots[index].classList.add('active');
        }
    }
    
    // Initialize slider
    if (promotionCards.length > 0) {
        showSlide(currentSlide);
        
        // Previous button click
        if (sliderPrev) {
            sliderPrev.addEventListener('click', function() {
                currentSlide--;
                if (currentSlide < 0) {
                    currentSlide = promotionCards.length - 1;
                }
                showSlide(currentSlide);
            });
        }
        
        // Next button click
        if (sliderNext) {
            sliderNext.addEventListener('click', function() {
                currentSlide++;
                if (currentSlide >= promotionCards.length) {
                    currentSlide = 0;
                }
                showSlide(currentSlide);
            });
        }
        
        // Dot clicks
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Auto slide
        setInterval(function() {
            currentSlide++;
            if (currentSlide >= promotionCards.length) {
                currentSlide = 0;
            }
            showSlide(currentSlide);
        }, 5000);
    }
    
    // Cookie Consent
    const cookieConsent = document.querySelector('.cookie-consent');
    const acceptCookieBtn = document.querySelector('.cookie-consent .btn-primary');
    
    if (acceptCookieBtn && cookieConsent) {
        // Check if user already accepted cookies
        if (localStorage.getItem('cookiesAccepted') === 'true') {
            cookieConsent.style.display = 'none';
        }
        
        acceptCookieBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.style.display = 'none';
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
  // Sélection des éléments
  const serviceCards = document.querySelectorAll('.service-card');
  const modal = document.getElementById('serviceModal');
  const closeBtn = document.querySelector('.close-modal');
  
  // Gestion des clics sur les cartes
  serviceCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Empêche le comportement par défaut si on clique sur le lien
      if (e.target.tagName === 'A') {
        e.preventDefault();
      }
      
      // Affiche la modal
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden'; // Empêche le défilement
    });
  });
  
  // Fermeture de la modal
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  
  // Fermer en cliquant en dehors
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});
