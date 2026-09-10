document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Config
    const colors = ['#FF6B35', '#FF8C42', '#F7C59F', '#FFB088', 'rgba(255,107,53,0.5)'];
    const maxDistance = 150;
    const lineColor = 'rgba(255,107,53,0.06)';
    
    let particles = [];
    let particleCount = window.innerWidth < 768 ? 40 : 80;
    
    let mouse = {
        x: null,
        y: null,
        radius: 100
    };

    // Handle mouse movement
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Update particle count on resize if transitioning between mobile/desktop
        const newParticleCount = window.innerWidth < 768 ? 40 : 80;
        if (newParticleCount !== particleCount) {
            particleCount = newParticleCount;
            init();
        }
    }

    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1; // 1-3px
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.baseX = this.x;
            this.baseY = this.y;
            this.vx = (Math.random() - 0.5) * 1; // slow drift
            this.vy = (Math.random() - 0.5) * 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse interaction
            if (mouse.x !== null && mouse.x !== undefined) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    
                    // Gentle repel
                    const force = (mouse.radius - distance) / mouse.radius;
                    const repelStrength = 1.5;
                    
                    this.x -= forceDirectionX * force * repelStrength;
                    this.y -= forceDirectionY * force * repelStrength;
                }
            }
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        connect();
        requestAnimationFrame(animate);
    }

    // Initialize and start animation
    resizeCanvas();
    init();
    animate();
});
