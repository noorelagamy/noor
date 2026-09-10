/* =============================================
   PORTFOLIO JAVASCRIPT
   Abdelrahman Shoman - AI Specialist & Data Analyst
   ============================================= */

// ==========================================
// 1. TYPEWRITER EFFECT
// ==========================================
class TypeWriter {
    constructor(element, words, waitTime = 2000) {
        this.element = element;
        this.words = words;
        this.waitTime = waitTime;
        this.wordIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.wordIndex % this.words.length;
        const fullText = this.words[current];

        if (this.isDeleting) {
            this.charIndex--;
        } else {
            this.charIndex++;
        }

        this.element.textContent = fullText.substring(0, this.charIndex);

        let typeSpeed = this.isDeleting ? 50 : 100;

        if (!this.isDeleting && this.charIndex === fullText.length) {
            typeSpeed = this.waitTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// ==========================================
// 2. NAVBAR FUNCTIONALITY
// ==========================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    allNavLinks.forEach(l => l.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    });
}

// ==========================================
// 3. COUNTER ANIMATION
// ==========================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 100;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const increment = target / speed;
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ==========================================
// 4. SKILL BARS ANIMATION
// ==========================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.level-bar');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.getAttribute('data-level');
                bar.style.width = level + '%';
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => observer.observe(bar));
}

// ==========================================
// 5. PROJECT FILTERING
// ==========================================
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ==========================================
// 6. CONTACT FORM (Telegram Bot — 100% FREE)
// ==========================================
// -------------------------------------------------------
// HOW TO SET UP (takes 2 minutes):
//
// STEP 1: Create a Telegram Bot
//   1. Open Telegram and search for @BotFather
//   2. Send /newbot
//   3. Give it a name (e.g., "Portfolio Contact Bot")
//   4. Give it a username (e.g., "shoman_portfolio_bot")
//   5. Copy the BOT TOKEN it gives you → paste below
//
// STEP 2: Get your Chat ID
//   1. Open Telegram and search for @userinfobot
//   2. Send /start
//   3. It will reply with your Chat ID (a number)
//   4. Copy it → paste below
//
// STEP 3: IMPORTANT — Start your bot!
//   1. Search for YOUR bot (@shoman_portfolio_bot)
//   2. Press "Start" — this is required or messages won't arrive
//
// That's it! Messages from the form will now arrive on Telegram.
// -------------------------------------------------------
const TELEGRAM_BOT_TOKEN = '8988570600:AAEh39CCJJ7ACgsnrt5XyMITobTjqZGdR9A';
const TELEGRAM_CHAT_ID   = '1299061746';

function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    submitBtn.addEventListener('click', () => {
        // Validate form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Collect form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Format a clean Telegram message
        const telegramMessage =
`📩 *New Portfolio Message!*

👤 *Name:* ${name}
📧 *Email:* ${email}
📝 *Subject:* ${subject}

💬 *Message:*
${message}

━━━━━━━━━━━━━━━━━━
🕐 _${new Date().toLocaleString('en-EG', { dateStyle: 'full', timeStyle: 'short' })}_`;

        // Check if Telegram is configured
        if (TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN') {
            // Fallback: open mailto link if not configured
            const mailtoLink = `mailto:a.shoman.643@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                `From: ${name} (${email})\n\n${message}`
            )}`;
            window.open(mailtoLink, '_blank');

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            formStatus.className = 'form-status success';
            formStatus.textContent = '📧 Opening your email client...';
            formStatus.style.display = 'block';
            form.reset();
            setTimeout(() => { formStatus.style.display = 'none'; }, 4000);
            return;
        }

        // Send via Telegram Bot API (completely free!)
        const telegramAPI = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        fetch(telegramAPI, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown',
            }),
        })
            .then(response => response.json())
            .then(data => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                if (data.ok) {
                    formStatus.className = 'form-status success';
                    formStatus.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                    formStatus.style.display = 'block';
                    form.reset();
                } else {
                    throw new Error(data.description || 'Telegram API error');
                }

                setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
            })
            .catch((error) => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;

                formStatus.className = 'form-status error';
                formStatus.textContent = '❌ Failed to send message. Please try again or email me directly.';
                formStatus.style.display = 'block';

                console.error('Telegram Error:', error);
                setTimeout(() => { formStatus.style.display = 'none'; }, 5000);
            });
    });
}

// ==========================================
// 7. BACK TO TOP BUTTON
// ==========================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// 8. PARTICLE EFFECT (Hero Background)
// ==========================================
function createParticles() {
    const heroShapes = document.querySelector('.hero-bg-shapes');
    if (!heroShapes) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        heroShapes.appendChild(particle);
    }
}

// ==========================================
// 9. SMOOTH REVEAL ON SCROLL (Custom)
// ==========================================
function initSmoothReveal() {
    // Additional reveal animations for elements not covered by AOS
    const revealElements = document.querySelectorAll('.service-card, .skill-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}

// ==========================================
// 10. TILT EFFECT ON HOVER (Project Cards)
// ==========================================
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });
}

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
    });

    // Initialize Typewriter
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        new TypeWriter(typewriterEl, [
            'AI Specialist',
            'Data Analyst',
            'ML Engineer',
            'Computer Vision Developer',
            'NLP Enthusiast',
            'Problem Solver'
        ], 2000);
    }

    // Initialize all modules
    initNavbar();
    animateCounters();
    animateSkillBars();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    createParticles();
    initSmoothReveal();
    initTiltEffect();
});
