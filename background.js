document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('blueprint-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); 
    let width, height;
    let lines = [];
    let animationId;
    
    let mouse = { x: -5000, y: -5000 };
    let targetMouse = { x: -5000, y: -5000 };

    const ORANGE_R = 253;
    const ORANGE_G = 190;
    const ORANGE_B = 2;
    
    let pulseIntensity = 0;
    window.pulseCanvas = (intensity = 1.5) => { pulseIntensity = intensity; };

    let cachedGradient;

    const createGradient = () => {
        cachedGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
        cachedGradient.addColorStop(0, '#101010'); 
        cachedGradient.addColorStop(1, '#020202'); 
    };

    const resize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        createGradient();
        initLines();
    };

    class Line {
        constructor(axis) { this.axis = axis; this.reset(); this.progress = Math.random() * 100; }
        reset() {
            this.pos = this.axis === 'h' ? Math.random() * height : Math.random() * width;
            this.speed = (Math.random() * 0.2 + 0.05) * (Math.random() < 0.5 ? 1 : -1); 
            this.length = Math.random() * 300 + 50;
            this.progress = 0;
            this.baseAlpha = Math.random() * 0.05 + 0.01; 
        }
        update() {
            this.progress += this.speed;
            const max = this.axis === 'h' ? width : height;
            if (this.progress > max + this.length || this.progress < -this.length) {
                this.reset();
                this.progress = this.speed > 0 ? -this.length : max + this.length;
            }
        }
        draw() {
            let alpha = this.baseAlpha + (pulseIntensity * 0.1);
            if (alpha <= 0.01) return; 

            let centerX = this.axis === 'h' ? this.progress + this.length / 2 : this.pos;
            let centerY = this.axis === 'h' ? this.pos : this.progress + this.length / 2;
            
            let r = 255, g = 255, b = 255;
            
            if (mouse.x > 0) {
                const dx = centerX - mouse.x;
                const dy = centerY - mouse.y;
                if (dx*dx + dy*dy < 160000) { 
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const proximity = 1 - (dist / 400);
                    r = 255 + (ORANGE_R - 255) * proximity;
                    g = 255 + (ORANGE_G - 255) * proximity;
                    b = 255 + (ORANGE_B - 255) * proximity;
                    alpha += proximity * 0.4; 
                }
            }
            alpha = Math.min(alpha, 0.8);

            ctx.beginPath();
            ctx.strokeStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${alpha})`;
            ctx.lineWidth = 1;
            if (this.axis === 'h') { ctx.moveTo(this.progress, this.pos); ctx.lineTo(this.progress + this.length, this.pos); } 
            else { ctx.moveTo(this.pos, this.progress); ctx.lineTo(this.pos, this.progress + this.length); }
            ctx.stroke();

            if (alpha > 0.1) {
                ctx.fillStyle = ctx.strokeStyle;
                const s = 1.5;
                if(this.axis === 'h') { 
                    ctx.fillRect(this.progress, this.pos-s/2, s, s); 
                    ctx.fillRect(this.progress+this.length, this.pos-s/2, s, s); 
                } else { 
                    ctx.fillRect(this.pos-s/2, this.progress, s, s); 
                    ctx.fillRect(this.pos-s/2, this.progress+this.length, s, s); 
                }
            }
        }
    }

    const initLines = () => {
        lines = [];
        const isMobile = window.innerWidth < 768;
        const divider = isMobile ? 30 : 15; 
        const count = (width + height) / divider; 
        for (let i = 0; i < count; i++) lines.push(new Line(Math.random() < 0.5 ? 'h' : 'v'));
    };

    window.addEventListener('resize', () => {
        resize();
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(resize, 100);
    });

    window.addEventListener('mousemove', (e) => {
        targetMouse.x = e.clientX;
        targetMouse.y = e.clientY;
    });

    const animate = () => {
        if(document.hidden) { 
            animationId = requestAnimationFrame(animate); 
            return; 
        }

        const dx = targetMouse.x - mouse.x;
        const dy = targetMouse.y - mouse.y;
        if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
             mouse.x += dx * 0.1;
             mouse.y += dy * 0.1;
        }

        if(pulseIntensity > 0.01) pulseIntensity *= 0.92;
        else pulseIntensity = 0;

        ctx.fillStyle = cachedGradient;
        ctx.fillRect(0,0,width,height);
        
        lines.forEach(line => { line.update(); line.draw(); });
        animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
});