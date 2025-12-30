document.addEventListener('DOMContentLoaded', () => {
    
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    const body = document.body;

    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        requestAnimationFrame(() => {
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            ring.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        });
    });

    const triggers = document.querySelectorAll('a, button, .hover-trigger, .accordion-trigger');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            body.classList.add('hovered');
        });
        trigger.addEventListener('mouseleave', () => {
            body.classList.remove('hovered');
        });
    });

    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (y / (rect.height / 2)) * -10; 
            const rotateY = (x / (rect.width / 2)) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    document.addEventListener('mouseleave', () => {
        dot.style.opacity = 0;
        ring.style.opacity = 0;
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = 1;
        ring.style.opacity = 0.4;
    });
});