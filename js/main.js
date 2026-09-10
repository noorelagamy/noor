document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // 2. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('#mobileMenu a');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            if (navbar) navbar.classList.toggle('mobile-open');
        });

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                if (navbar) navbar.classList.remove('mobile-open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                if (navbar) navbar.classList.remove('mobile-open');
            }
        });
    }

    // 3. Smooth Scrolling & Nav Active State
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            if (this.classList.contains('nav-link')) {
                this.classList.add('active');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 4. Active Nav Link Highlighting
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
                    if (correspondingLink) {
                        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                        correspondingLink.classList.add('active');
                    }
                }
            });
        }, { rootMargin: '-20% 0px -80% 0px' });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // 5. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const parent = el.parentElement;
                    const siblings = Array.from(parent.querySelectorAll('[data-reveal]'));
                    const index = siblings.indexOf(el);
                    
                    if (index > 0) {
                        el.style.transitionDelay = `${index * 100}ms`;
                    }

                    el.classList.add('revealed');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // 6. Typing Effect for Hero
    const typingTextElement = document.getElementById('typingText');
    
    if (typingTextElement) {
        const roles = ['Data Analyst.', 'Finance Professional.', 'Business Intelligence.', 'Problem Solver.', 'Excel Expert.'];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isDeleting) {
                typingTextElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingTextElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 40 : 60;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(typeEffect, typeSpeed);
        }

        typeEffect();
    }

    // 7. Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const statsSection = document.querySelector('.about-stats');

    if (statNumbers.length > 0 && statsSection) {
        const easeOutQuad = t => t * (2 - t);

        const animateCount = (el) => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            const duration = 2000;
            let start = null;

            const step = (timestamp) => {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percentage = Math.min(progress / duration, 1);
                const easedProgress = easeOutQuad(percentage);
                
                const currentCount = Math.floor(easedProgress * target);
                el.textContent = currentCount;

                if (progress < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    el.textContent = target;
                }
            };
            
            window.requestAnimationFrame(step);
        };

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statNumbers.forEach(stat => animateCount(stat));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        statsObserver.observe(statsSection);
    }

    // 8. Contact Form — Direct Telegram Integration
    const TELEGRAM_BOT_TOKEN = '8901315393:AAGEq9kyw6CEOQWoE3IWP0B5Ud7pOUeo0K4';
    const TELEGRAM_CHAT_ID = '1414327005';

    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnSpan = submitBtn ? submitBtn.querySelector('span') : null;
            const originalText = btnSpan ? btnSpan.textContent : 'Send Message';
            
            if (btnSpan) btnSpan.textContent = 'Sending...';
            if (submitBtn) submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            const telegramText = `📩 New Portfolio Message!\n\n👤 Name: ${name}\n📧 Email: ${email}\n\n💬 Message:\n${message}\n\n🕐 ${new Date().toLocaleString()}`;

            try {
                const response = await fetch(
                    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: TELEGRAM_CHAT_ID,
                            text: telegramText,
                        }),
                    }
                );

                if (response.ok) {
                    contactForm.style.display = 'none';
                    if (formSuccess) formSuccess.classList.add('active');
                    contactForm.reset();

                    setTimeout(() => {
                        if (formSuccess) formSuccess.classList.remove('active');
                        contactForm.style.display = 'flex';
                    }, 4000);
                } else {
                    throw new Error('Failed to send message.');
                }
            } catch (error) {
                alert('An error occurred. Please try again or contact me directly via email.');
            } finally {
                if (btnSpan) btnSpan.textContent = originalText;
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});
