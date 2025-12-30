document.addEventListener('DOMContentLoaded', () => {
    
    const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024;
    const body = document.body;

    if (typeof siteContent !== 'undefined') {
        Object.keys(siteContent).forEach(id => {
            if (id === 'links') return;
            const el = document.getElementById(id);
            if (el) el.innerHTML = siteContent[id]; 
        });

        if (siteContent.links && siteContent.links.telegram) {
            const tgLink = siteContent.links.telegram;
            document.querySelectorAll('#nav-tg, #contact-btn, #hero-btn, .tg-btn').forEach(btn => {
                if(btn) { btn.href = tgLink; btn.target = "_blank"; }
            });
        }
    }

    const menuToggle = document.getElementById('menu-toggle');
    const navGlass = document.querySelector('.nav-glass');
    
    if (menuToggle && navGlass) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navGlass.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (navGlass.classList.contains('active') && !navGlass.contains(e.target) && !menuToggle.contains(e.target)) {
                navGlass.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        navGlass.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navGlass.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    if (!isMobile) {
        const splitText = (selector) => {
            document.querySelectorAll(selector).forEach(el => {
                if(el.classList.contains('split-done')) return;
                const text = el.textContent;
                if(!text.trim()) return; 
                
                el.innerHTML = text.split(" ").map(word => {
                    return `<span style="display: inline-block; overflow: hidden; vertical-align: bottom;">
                                <span class="split-word" style="display: inline-block; transform: translateY(100%); transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1);">${word}&nbsp;</span>
                            </span>`;
                }).join("");
                el.classList.add('split-done');
            });
        };
        setTimeout(() => { splitText('h1'); splitText('h2'); }, 100);
    } else {
        document.querySelectorAll('h1, h2').forEach(el => el.classList.add('mobile-fade-ready'));
    }

    const loader = document.getElementById('preloader');
    const txt = document.querySelector('.loader-percent');
    const line = document.querySelector('.loader-line::after');
    let percent = 0;
    
    const finishLoad = () => {
        if(loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                revealIntro(); 
            }, 600);
        }
    };

    setTimeout(finishLoad, 2500);

    const updateLoader = () => {
        percent += (100 - percent) * 0.15;
        if(txt) txt.textContent = Math.floor(percent) + '%';
        if(line) line.style.transform = `translateX(${percent - 100}%)`;

        if (percent > 99) finishLoad();
        else requestAnimationFrame(updateLoader);
    };
    updateLoader();

    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: isMobile ? 0.8 : 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
            smoothTouch: false
        });

        lenis.on('scroll', (e) => {
            if (!isMobile) {
                document.querySelectorAll('.project-card .proj-img').forEach(img => {
                    const rect = img.parentElement.getBoundingClientRect();
                    if(rect.top < window.innerHeight && rect.bottom > 0) {
                        const dist = (rect.top - window.innerHeight / 2) * 0.15;
                        img.style.transform = `translateY(${dist}px)`;
                    }
                });
            }

            const header = document.querySelector('header');
            if(header) {
                if(e.direction === 1 && e.scroll > 100) header.classList.add('hide');
                else header.classList.remove('hide');
            }
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    const revealIntro = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    if (!isMobile) {
                        const spans = entry.target.querySelectorAll('.split-word');
                        spans.forEach((span, idx) => {
                            setTimeout(() => { span.style.transform = 'translateY(0)'; }, idx * 30);
                        });
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); 

        document.querySelectorAll('.reveal, h1, h2, #hero-title, #hero-desc, .btn-wrapper').forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    };

    const showMoreBtn = document.getElementById('show-more-btn');
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const hiddenProjects = document.querySelectorAll('.hidden-project');
            const btnTextSpan = showMoreBtn.querySelector('.btn-text');
            const isExpanded = showMoreBtn.classList.contains('expanded');
            const textMore = (typeof siteContent !== 'undefined') ? siteContent["show-more-btn"] : "Показать еще";
            const textLess = (typeof siteContent !== 'undefined') ? siteContent["show-less-btn"] : "Свернуть";

            if (!isExpanded) {
                hiddenProjects.forEach(proj => {
                    proj.style.display = 'block';
                    setTimeout(() => { proj.style.opacity = '1'; proj.style.transform = 'translateY(0)'; }, 50);
                });
                if (btnTextSpan) btnTextSpan.textContent = textLess;
                showMoreBtn.classList.add('expanded');
            } else {
                hiddenProjects.forEach(proj => {
                    proj.style.display = 'none';
                    proj.style.opacity = '0';
                });
                if (btnTextSpan) btnTextSpan.textContent = textMore;
                showMoreBtn.classList.remove('expanded');
                if(lenis) lenis.scrollTo('#projects', {offset: -100});
            }
        });
    }

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                if (entry.target.classList.contains('proj-video')) {
                     entry.target.play().catch(()=>{});
                }
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('video').forEach(v => videoObserver.observe(v));


    if (!isMobile) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        let audioCtx;
        const playSound = (freq) => {
            if (!audioCtx) { audioCtx = new AudioContext(); }
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        };

        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        
        if (dot && ring) {
            let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX; mouseY = e.clientY;
                dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
                
                const target = e.target.closest('.card, .project-card, .client-box');
                if (target) {
                    const glow = target.querySelector('.glow-bg');
                    if (glow) {
                        const rect = target.getBoundingClientRect();
                        glow.style.left = (mouseX - rect.left) + 'px';
                        glow.style.top = (mouseY - rect.top) + 'px';
                    }
                }
            });

            const renderCursor = () => {
                ringX += (mouseX - ringX) * 0.15;
                ringY += (mouseY - ringY) * 0.15;
                ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
                requestAnimationFrame(renderCursor);
            };
            renderCursor();

            document.querySelectorAll('a, button, .accordion-trigger').forEach(el => {
                el.addEventListener('mouseenter', () => { body.classList.add('hovered'); playSound(300); });
                el.addEventListener('mouseleave', () => body.classList.remove('hovered'));
            });
            
            const tiltCards = document.querySelectorAll('.tilt-card');
            tiltCards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    card.style.transform = `perspective(1000px) rotateX(${(y / rect.height) * -10}deg) rotateY(${(x / rect.width) * 10}deg) scale(1.02)`;
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
                });
            });
        }
    } 

    document.querySelectorAll('.accordion-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const content = item.querySelector('.accordion-content');
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = null;
            });

            if(!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});