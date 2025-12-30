const projectVideos = [
    "video3.mp4", 
    "video2.mp4", 
    "video6.mp4", 
    "video4.mp4",
	"video5.mp4", 
	"video1.mp4",
	"video7.mp4" 
];

document.addEventListener('DOMContentLoaded', () => {
    console.log("Video Player: Initialized");

    const cards = document.querySelectorAll('.project-card');
    const isMobile = window.innerWidth < 768;
    

    if (!document.getElementById('video-modal')) {
        const modalHTML = `
            <div id="video-modal" class="video-modal">
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <video id="fullscreen-video" controls playsinline></video>
                    <button id="close-modal-btn" aria-label="Close">✕</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('video-modal');
    const fullVideo = document.getElementById('fullscreen-video');
    const closeBtn = document.getElementById('close-modal-btn');
    const backdrop = document.querySelector('.modal-backdrop');


    cards.forEach((card, index) => {
        const videoSrc = projectVideos[index];
        
        if (videoSrc && videoSrc !== "") {
            card.style.cursor = 'pointer'; 
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Open project video');
            const previewVideo = card.querySelector('.proj-video');
            if (previewVideo) {
                previewVideo.src = videoSrc;
                previewVideo.muted = true;
                previewVideo.loop = true;
                previewVideo.playsInline = true;
                if(isMobile) {
                    previewVideo.preload = "none";
                }
                if (!isMobile) {
                    card.addEventListener('mouseenter', () => previewVideo.play().catch(()=>{}));
                    card.addEventListener('mouseleave', () => previewVideo.pause());
                } else {
                     previewVideo.preload = "metadata";
                }
            }

            card.onclick = (e) => {
                if(e.target.closest('button') || e.target.closest('a')) return;
                e.preventDefault();
                e.stopPropagation();
                openFullscreenVideo(videoSrc);
            };
        }
    });

    function openFullscreenVideo(src) {
        fullVideo.src = src;
        fullVideo.load();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
        
        const playPromise = fullVideo.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.log("Auto-play prevented"));
        }
    }

    function closeFullscreenVideo() {
        modal.classList.remove('active');
        fullVideo.pause();
        fullVideo.currentTime = 0;
        document.body.style.overflow = '';
        
        setTimeout(() => {
            fullVideo.src = ""; 
            fullVideo.load();
        }, 500);
    }

    closeBtn.addEventListener('click', closeFullscreenVideo);
    backdrop.addEventListener('click', closeFullscreenVideo);
    
    let touchStartY = 0;
    modal.addEventListener('touchstart', e => touchStartY = e.changedTouches[0].screenY, {passive: true});
    modal.addEventListener('touchend', e => {
        if (e.changedTouches[0].screenY < touchStartY - 100) closeFullscreenVideo();
    }, {passive: true});

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeFullscreenVideo();
    });
});