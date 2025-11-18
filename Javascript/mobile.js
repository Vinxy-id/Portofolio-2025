document.addEventListener('DOMContentLoaded', function() {
    
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const body = document.body;
    
    if (hamburger && navbar) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation(); 
            this.classList.toggle('active');
            navbar.classList.toggle('active');
            
            if (navbar.classList.contains('active')) {
                body.style.overflow = 'hidden';
                body.classList.add('menu-open');
            } else {
                body.style.overflow = '';
                body.classList.remove('menu-open');
            }
        });
        
        
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                body.style.overflow = '';
                body.classList.remove('menu-open');
            });
        });
        
        
        document.addEventListener('click', function(e) {
            if (navbar.classList.contains('active') && 
                !navbar.contains(e.target) && 
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                body.style.overflow = '';
                body.classList.remove('menu-open');
            }
        });
        
        // Close menu dengan ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navbar.classList.contains('active')) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                body.style.overflow = '';
                body.classList.remove('menu-open');
            }
        });
        
        // Handle window resize - close menu jika kembali ke desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navbar.classList.contains('active')) {
                hamburger.classList.remove('active');
                navbar.classList.remove('active');
                body.style.overflow = '';
                body.classList.remove('menu-open');
            }
        });
    }
    
    
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
        
        
        const buttons = document.querySelectorAll('.btn, .filter-btn, .portfolio-item');
        buttons.forEach(btn => {
            btn.style.cursor = 'pointer';
        });
    }
    
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
});