// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

// Wrap everything that needs the DOM
document.addEventListener('DOMContentLoaded', () => {

    const player = document.getElementById('audioPlayer');
    const gate = document.getElementById('clickGate');


    if (gate && player) {
        gate.addEventListener('click', () => {
            player.play().catch(err => console.warn('Playback blocked:', err));
            gate.classList.add('hidden');

        });
    }

    const audio = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playPauseBtn');
  const progressBar = document.getElementById('seekBar');
  const progress = document.getElementById('progress');
  const progressDot = document.getElementById('progressDot');
  const currentTimeElem = document.getElementById('current');
  const durationElem = document.getElementById('duration');

  function fmt(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // Play / Pause
  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.textContent = '❚❚';
    } else {
      audio.pause();
      playBtn.textContent = '▶';
    }
  });

  // Update progress as audio plays
  audio.addEventListener('timeupdate', () => {
    if (!isFinite(audio.duration) || audio.duration === 0) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progress.style.width = pct + '%';
    progressDot.style.left = `calc(${pct}% - 6px)`;
    currentTimeElem.textContent = fmt(audio.currentTime);
  });

  // Set total duration
  audio.addEventListener('loadedmetadata', () => {
    durationElem.textContent = fmt(audio.duration || 0);
  });

  // Seek on click
  progressBar.addEventListener('click', (e) => {
    if (!isFinite(audio.duration) || audio.duration === 0) return;
    const rect = progressBar.getBoundingClientRect();
    const pct = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1);
    audio.currentTime = audio.duration * pct;
  });






    

    // Copie du texte au clic
    const button = document.querySelector('.hoverButton');
    if (button) { // ensure button exists
        button.addEventListener('click', () => {
            const textToCopy = "1571990998";
            navigator.clipboard.writeText(textToCopy).then(() => {
                button.classList.add('copied');
                setTimeout(() => {
                    button.classList.remove('copied');
                }, 2000); 
            }).catch(err => {
                console.error('Erreur lors de la copie :', err);
            });
        });
    }

});
