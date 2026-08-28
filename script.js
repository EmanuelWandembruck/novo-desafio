// Controlar Áudio Ambiente (Hedwig's Theme)
const audio = document.getElementById('bgAudio');
const audioBtn = document.getElementById('audioBtn');
let isPlaying = false;

audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play().then(() => {
            audioBtn.innerText = '⚡ Som Ambiente: ON (Hedwig\'s Theme)';
            audioBtn.classList.add('active');
            isPlaying = true;
        }).catch(err => {
            console.error("Erro ao reproduzir o áudio:", err);
        });
    } else {
        audio.pause();
        audioBtn.innerText = '⚡ Som Ambiente: OFF';
        audioBtn.classList.remove('active');
        isPlaying = false;
    }
});