document.addEventListener('DOMContentLoaded', function() {
    emailjs.init("IFIePzX9BzSRR1ITj");
    
    const contactForm = document.getElementById('contactForm');
    let submitAttempts = 0; // Counter untuk batasi percobaan
    const MAX_ATTEMPTS = 3; // Maksimal 3x kirim per session

    function validateForm(formData) {
        const errors = [];
        
        const name = formData.get('from_name')?.trim() || '';
        const email = formData.get('from_email')?.trim() || '';
        const subject = formData.get('subject')?.trim() || '';
        const message = formData.get('message')?.trim() || '';
        
        // 🔒 VALIDASI NAMA SUPER KETAT
        if (name.length < 2) {
            errors.push('Name must be at least 2 characters');
        }
        if (name.length > 50) {
            errors.push('Name too long (max 50 characters)');
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            errors.push('Name can only contain letters and spaces');
        }
        
        // 🔒 VALIDASI EMAIL SUPER KETAT
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            errors.push('Email is required');
        } else if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        } else if (email.length > 100) {
            errors.push('Email too long');
        }
        
        // 🔒 CEK EMAIL TEMPORARY/DISPOSABLE
        const tempDomains = ['tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com', 'yopmail.com', 'fakeemail.com'];
        const emailDomain = email.split('@')[1];
        if (tempDomains.some(domain => emailDomain.includes(domain))) {
            errors.push('Temporary/disposable emails are not allowed');
        }
        
        // 🔒 VALIDASI SUBJECT
        if (subject.length < 5) {
            errors.push('Subject must be at least 5 characters');
        }
        if (subject.length > 100) {
            errors.push('Subject too long (max 100 characters)');
        }
        
        // 🔒 VALIDASI MESSAGE
        if (message.length < 20) {
            errors.push('Message must be at least 20 characters');
        }
        if (message.length > 1000) {
            errors.push('Message too long (max 1000 characters)');
        }
        
        // 🔒 ANTI-SPAM: Cek kata-kata spam
        const spamWords = ['viagra', 'casino', 'lottery', 'click here', 'make money', 'urgent', 'buy now', 'discount'];
        const lowerMessage = message.toLowerCase();
        if (spamWords.some(word => lowerMessage.includes(word))) {
            errors.push('Message contains suspicious content');
        }
        
        return errors;
    }
    
    // 🔒 HONEYPOT FIELD (Anti-bot)
    function addHoneypotField() {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.display = 'none';
        honeypot.placeholder = 'Do not fill this field';
        contactForm.appendChild(honeypot);
    }
    
    // Panggil honeypot
    addHoneypotField();
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 🔒 CEK HONEYPOT (jika diisi, berarti bot)
        const honeypot = this.querySelector('input[name="website"]');
        if (honeypot.value) {
            console.log('Bot detected via honeypot');
            return; // Silent fail untuk bot
        }
        
        // 🔒 CEK ATTEMPTS LIMIT
        if (submitAttempts >= MAX_ATTEMPTS) {
            Swal.fire({
                icon: 'error',
                title: 'Too Many Attempts',
                text: `You can only send ${MAX_ATTEMPTS} messages per session. Please try again later.`,
                background: 'rgba(255, 255, 255, 0.1)',
                backdrop: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        try {
            // Show loading
            submitBtn.innerHTML = '<i class="ri-loader-4-line spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // 🔒 VALIDATE USER INPUT
            const formData = new FormData(this);
            const validationErrors = validateForm(formData);
            
            if (validationErrors.length > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please Check Your Input',
                    html: validationErrors.map(error => `• ${error}`).join('<br>'),
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdrop: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    confirmButtonText: 'OK'
                });
                return;
            }
            
            // 🔒 TAMBAH DELAY (anti-spam)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Kirim email
            const result = await emailjs.sendForm('service_vdtxsa1', 'template_rn2ty5m', this);
            
            // 🔒 INCREMENT ATTEMPTS
            submitAttempts++;
            
            Swal.fire({
                icon: 'success',
                title: 'Message Sent! 🎉',
                text: 'Thank you! I will reply within 24 hours.',
                background: 'rgba(255, 255, 255, 0.1)',
                backdrop: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                confirmButtonText: 'OK'
            });
            
            contactForm.reset();
            
        } catch (error) {
            // 🔒 INCREMENT ATTEMPTS MESKI ERROR
            submitAttempts++;
            
            console.error('EmailJS Error:', error);
            
            Swal.fire({
                icon: 'error',
                title: 'Sending Failed',
                text: 'Please try again later or contact me directly.',
                background: 'rgba(255, 255, 255, 0.1)',
                backdrop: 'rgba(0, 0, 0, 0.8)',
                color: '#fff',
                confirmButtonText: 'OK'
            });
            
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // 🔒 REAL-TIME VALIDATION
    const emailInput = contactForm.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                this.style.borderColor = '#f87171'; // Red border
            } else {
                this.style.borderColor = ''; // Reset
            }
        });
    }
});