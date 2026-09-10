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

        // Close menu when clicking link
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                if (navbar) navbar.classList.remove('mobile-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileMenu.classList.remove('active');
                if (navbar) navbar.classList.remove('mobile-open');
            }
        });
    }

    // 3. Smooth Scrolling & 9. Navbar Link Active State on Click
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add active class on click
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

    // 4. Active Nav Link Highlighting via IntersectionObserver
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
        // Group elements by parent to apply staggered delays
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    // Add staggered delay for siblings if they share the same parent
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
        let typingTimeout;

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
                typeSpeed = 2000; // Pause after typing complete
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before next role
            }

            typingTimeout = setTimeout(typeEffect, typeSpeed);
        }

        typeEffect();
    }

    // 7. Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const statsSection = document.querySelector('.about-stats'); // Assuming this section wraps the stats

    if (statNumbers.length > 0 && statsSection) {
        // easeOutQuad function
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
                    el.textContent = target; // Ensure it ends exactly on the target
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

    // 8. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
            
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }

            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    contactForm.style.display = 'none';
                    if (formSuccess) formSuccess.classList.add('active');
                    contactForm.reset();

                    // Reset form after 4 seconds
                    setTimeout(() => {
                        if (formSuccess) formSuccess.classList.remove('active');
                        contactForm.style.display = 'block';
                    }, 4000);
                } else {
                    throw new Error('Failed to send message.');
                }
            } catch (error) {
                alert(error.message || 'An error occurred while sending the message.');
            } finally {
                if (submitBtn) {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            }
        });
    }
});
