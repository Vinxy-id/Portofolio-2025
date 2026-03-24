/**
 * main.js - Consolidated SPA Logic for Vinxy Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initializations
    initSPA();
    initMobile();
    initPortfolio();
    initContact();
    initVisualEffects();
});

/* =========================================
   SPA Navigation Logic
   ========================================= */
function initSPA() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.page-section');
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');

    function switchSection(targetId) {
        // Ensure ID starts with #
        if (!targetId.startsWith('#')) return;
        
        const targetSection = document.querySelector(targetId);
        if (!targetSection) return;

        // Update Nav Menu Links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });

        // Hide All Sections
        sections.forEach(section => {
            section.classList.remove('active');
            section.classList.remove('animated'); // Clear animation for re-trigger
        });

        // Show Target Section
        targetSection.classList.add('active');
        
        // Re-trigger Entrance Animation
        void targetSection.offsetWidth; // Force reflow
        targetSection.classList.add('animated');

        // Re-initialize specific section logic if needed
        if (targetId === '#portfolio') initPortfolio();
        if (targetId === '#contact') initContact();

        // Close Mobile Menu on Click
        const currentHamburger = document.querySelector('.hamburger');
        if (navbar && navbar.classList.contains('active')) {
            if (currentHamburger) currentHamburger.classList.remove('active');
            navbar.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Handle Nav Link Clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                switchSection(href);
                // Update URL Hash without reload
                history.pushState(null, null, href);
            }
        });
    });

    // Handle Browser Back/Forward
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#home';
        switchSection(hash);
    });

    // Initial section load based on hash
    const initialHash = window.location.hash || '#home';
    switchSection(initialHash);
}

/* =========================================
   Mobile & Hamburger Logic (from mobile.js)
   ========================================= */
function initMobile() {
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const body = document.body;
    
    if (hamburger && navbar) {
        // Clear previous listeners to avoid duplicates if re-init
        hamburger.replaceWith(hamburger.cloneNode(true));
        const newHamburger = document.querySelector('.hamburger');
        
        newHamburger.addEventListener('click', (e) => {
            e.stopPropagation(); 
            newHamburger.classList.toggle('active');
            navbar.classList.toggle('active');
            
            if (navbar.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (navbar.classList.contains('active') && !navbar.contains(e.target) && !newHamburger.contains(e.target)) {
                newHamburger.classList.remove('active');
                navbar.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }
}

/* =========================================
   Portfolio Filtering Logic (from portofolio.js)
   ========================================= */
function initPortfolio() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            // Remove old listeners to prevent stacking
            btn.onclick = function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                portfolioItems.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            };
        });
    }
}

/* =========================================
   Contact Form Logic (from contact.js)
   ========================================= */
function initContact() {
    // Initialize EmailJS once
    if (typeof emailjs !== 'undefined') {
        emailjs.init("IFIePzX9BzSRR1ITj");
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Use onclick to overwrite and prevent duplicate listeners
        contactForm.onsubmit = async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            try {
                // Show loading
                submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Kirim email
                const result = await emailjs.sendForm('service_vdtxsa1', 'template_rn2ty5m', this);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent! 🎉',
                    text: 'Thank you! I will reply within 24 hours.',
                    background: 'rgba(34, 34, 34, 0.9)',
                    color: '#fff',
                    confirmButtonColor: '#fff',
                    confirmButtonText: '<span style="color:#222">OK</span>'
                });
                
                contactForm.reset();
                
            } catch (error) {
                console.error('EmailJS Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Sending Failed',
                    text: 'Please try again later.',
                    background: 'rgba(34, 34, 34, 0.9)',
                    color: '#fff'
                });
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        };
    }
}

/* =========================================
   Visual Effects (Mouse & Circles)
   ========================================= */
function initVisualEffects() {
    // Mouse follower logic
    if (!('ontouchstart' in window) && !navigator.maxTouchPoints) {
        let mouseFollower = document.querySelector('.mouse-follower');
        if (!mouseFollower) {
            mouseFollower = document.createElement('div');
            mouseFollower.className = 'mouse-follower';
            document.body.appendChild(mouseFollower);
            
            // Basic CSS for mouse follower
            Object.assign(mouseFollower.style, {
                position: 'fixed',
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: '9999',
                opacity: '0',
                transition: 'opacity 0.3s ease'
            });
        }

        document.addEventListener('mousemove', (e) => {
            mouseFollower.style.left = (e.clientX - 50) + 'px';
            mouseFollower.style.top = (e.clientY - 50) + 'px';
            mouseFollower.style.opacity = '1';

            // Parallax for blur circles
            const circles = document.querySelectorAll('.blur-circle');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            circles.forEach((circle, index) => {
                const speed = (index + 1) * 20;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                circle.style.transform = `translate(${x}px, ${y}px)`;
            });
        });

        document.addEventListener('mouseleave', () => {
            mouseFollower.style.opacity = '0';
        });
    }
}
