// Controle de Áudio Retro (Sintetizador 80s Stranger Things)
const audio = document.getElementById('bgAudio');
const audioBtn = document.getElementById('audioBtn');
let isPlaying = false;
let synthInterval = null;

// Sintetizador analógico que gera o arpejo icônico de Cmaj7 de Stranger Things
function startStrangerThingsSynth() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    // Arpejo clássico de Synthwave: C4, E4, G4, B4, C5, B4, G4, E4
    const notes = [
        { f: 261.63, d: 0.16 }, // C4
        { f: 329.63, d: 0.16 }, // E4
        { f: 392.00, d: 0.16 }, // G4
        { f: 493.88, d: 0.16 }, // B4
        { f: 523.25, d: 0.16 }, // C5
        { f: 493.88, d: 0.16 }, // B4
        { f: 392.00, d: 0.16 }, // G4
        { f: 329.63, d: 0.16 }  // E4
    ];

    function playArpeggio() {
        let time = ctx.currentTime;
        notes.forEach(note => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            // Onda Dente de Serra (sawtooth) para o timbre analógico vintage dos anos 80
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(note.f, time);
            
            gain.gain.setValueAtTime(0.001, time);
            gain.gain.exponentialRampToValueAtTime(0.14, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, time + note.d - 0.02);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(time);
            osc.stop(time + note.d);
            time += note.d + 0.01;
        });
    }

    playArpeggio();
    // Repete o ciclo do sintetizador continuamente
    synthInterval = setInterval(playArpeggio, 1360);
}

function stopStrangerThingsSynth() {
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
            audioBtn.innerText = '📻 TRANSMISSÃO: ON';
            audioBtn.classList.add('active');
            isPlaying = true;
        } catch (error) {
            // Se falhar o MP3, ativa o sintetizador de Stranger Things
            startStrangerThingsSynth();
            audioBtn.innerText = '📻 SINTETIZADOR 80S: ON';
            audioBtn.classList.add('active');
            isPlaying = true;
        }
    } else {
        audio.pause();
        audio.currentTime = 0;
        stopStrangerThingsSynth();
        audioBtn.innerText = '📻 TRANSMISSÃO: OFF';
        audioBtn.classList.remove('active');
        isPlaying = false;
    }
});

// Modal Lightbox (Evidências do Laboratório de Hawkins)
const lightbox = document.getElementById('lightboxModal');
const lightboxBody = document.getElementById('lightboxBody');

function openLightbox(type, src) {
    if (!lightbox || !lightboxBody) return;
    lightboxBody.innerHTML = '';
    if (type === 'video') {
        lightboxBody.innerHTML = `<video controls autoplay class="lightbox-media"><source src="${src}" type="video/mp4"></video>`;
    } else {
        lightboxBody.innerHTML = `<img src="${src}" class="lightbox-media" alt="Arquivo Confidencial">`;
    }
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.style.display = 'none';
    lightboxBody.innerHTML = '';
    lightbox.setAttribute('aria-hidden', 'true');
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Efeito Tilt 3D VHS nos Cards
const cards = document.querySelectorAll('.casa-card, .noticia-card, .galeria-item, .card-personagem, .card-tilt');
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

// Canvas de Esporos & Partículas do Mundo Invertido (Upside Down)
const canvas = document.getElementById('magicCanvas') || document.getElementById('upsideDownCanvas');
if (canvas) {
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
            // Alterna esporos entre Vermelho Neon e Azul Elétrico
            const isNeonRed = Math.random() > 0.5;
            const color = isNeonRed 
                ? `rgba(255, 0, 51, ${Math.random() * 0.8 + 0.2})` 
                : `rgba(0, 240, 255, ${Math.random() * 0.8 + 0.2})`;

            particles.push({
                x: e.clientX,
                y: e.clientY,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 1.5,
                speedY: (Math.random() - 0.5) * 1.5 - 0.5,
                color: color,
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
            p.life -= 0.025;

            if (p.life <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}