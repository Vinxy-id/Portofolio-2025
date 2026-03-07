document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    // Mouse follower hanya aktif jika bukan perangkat sentuh (desktop)
    if (!('ontouchstart' in window) && !navigator.maxTouchPoints) {
        const mouseFollower = document.createElement('div');
        mouseFollower.className = 'mouse-follower';
        document.body.appendChild(mouseFollower);

        document.addEventListener('mousemove', function(e) {
            mouseFollower.style.left = (e.clientX - 50) + 'px';
            mouseFollower.style.top = (e.clientY - 50) + 'px';
            mouseFollower.style.opacity = '1';
        });

        document.addEventListener('mouseleave', function() {
            mouseFollower.style.opacity = '0';
        });
        
        document.addEventListener('mousemove', function(e) {
            const circles = document.querySelectorAll('.blur-circle');
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            circles.forEach((circle, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 50;
                const y = (mouseY - 0.5) * speed * 50;
                
                circle.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    
    portfolioItems.forEach(item => {
        item.style.display = 'block';
        item.style.opacity = '1';
    });


});