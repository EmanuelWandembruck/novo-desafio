// Controle de Áudio Definitivo
const audio = document.getElementById('bgAudio');
const audioBtn = document.getElementById('audioBtn');
let isPlaying = false;
let synthInterval = null;

// Sintetizador robusto que toca a música em loop sem precisar de arquivo externo
function startHedwigsThemeSynth() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const notes = [
        { f: 493.88, d: 0.4 }, // B4
        { f: 659.25, d: 0.6 }, // E5
        { f: 783.99, d: 0.3 }, // G5
        { f: 739.99, d: 0.3 }, // F#5
        { f: 659.25, d: 0.7 }, // E5
        { f: 987.77, d: 0.4 }, // B5
        { f: 880.00, d: 0.8 }, // A5
        { f: 739.99, d: 0.8 }  // F#5
    ];

    function playMelody() {
        let time = ctx.currentTime;
        notes.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.f, time);
            
            gain.gain.setValueAtTime(0.001, time);
            gain.gain.exponentialRampToValueAtTime(0.15, time + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, time + note.d - 0.05);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(time);
            osc.stop(time + note.d);
            time += note.d + 0.05;
        });
    }

    playMelody();
    // Repete a melodia a cada 4.5 segundos
    synthInterval = setInterval(playMelody, 4500);
}

function stopHedwigsThemeSynth() {
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
}

audioBtn.addEventListener('click', async () => {
    if (!isPlaying) {
        try {
            audio.volume = 0.5;
            await audio.play();
            audioBtn.innerText = '⚡ Som Ambiente: ON';
            audioBtn.classList.add('active');
            isPlaying = true;
        } catch (error) {
            // Se o arquivo MP3 falhar, ativa o sintetizador imediatamente
            startHedwigsThemeSynth();
            audioBtn.innerText = '⚡ Som Ambiente: ON (Magia Sintética)';
            audioBtn.classList.add('active');
            isPlaying = true;
        }
    } else {
        audio.pause();
        audio.currentTime = 0;
        stopHedwigsThemeSynth();
        audioBtn.innerText = '⚡ Som Ambiente: OFF';
        audioBtn.classList.remove('active');
        isPlaying = false;
    }
});

// Modal Lightbox
const lightbox = document.getElementById('lightboxModal');
const lightboxBody = document.getElementById('lightboxBody');

function openLightbox(type, src) {
    lightboxBody.innerHTML = '';
    if (type === 'video') {
        lightboxBody.innerHTML = `<video controls autoplay class="lightbox-media"><source src="${src}" type="video/mp4"></video>`;
    } else {
        lightboxBody.innerHTML = `<img src="${src}" class="lightbox-media" alt="Mídia Ampliada">`;
    }
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxBody.innerHTML = '';
    lightbox.setAttribute('aria-hidden', 'true');
}

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Efeito Tilt 3D nos Cards
const cards = document.querySelectorAll('.card-tilt');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
});

// Canvas de Partículas Mágicas
const canvas = document.getElementById('magicCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
window.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 2; i++) {
        particles.push({
            x: e.clientX,
            y: e.clientY,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2 - 1,
            color: `hsl(${Math.random() * 40 + 35}, 100%, 75%)`,
            life: 1
        });
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;
        p.life -= 0.03;

        if (p.life <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animate);
}
animate();