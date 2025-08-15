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






    // Firebase config
    const firebaseConfig = {
        apiKey: "AIzaSyBFrfps5xA3LscO7ltRy1Wo6KZF-egTP3E",
        authDomain: "je-maime-46330.firebaseapp.com",
        projectId: "je-maime-46330",
        storageBucket: "je-maime-46330.firebasestorage.app",
        messagingSenderId: "614930169981",
        appId: "1:614930169981:web:0baa48a81edfc78b603114",
        measurementId: "G-9ZDE0Z57XJ"
    };

    // Initialize Firebase & Firestore
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const db = getFirestore(app);

    const commentSection = document.getElementById('commentSection');
    const submitBtn = document.getElementById('submitComment');

    // Fonction pour afficher un commentaire
    function renderComment(doc) {
        const data = doc.data();
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = `
            <div class="author">${escapeHTML(data.username)}</div>
            <div class="date">${data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : ''}</div>
            <div class="content">${escapeHTML(data.content)}</div>`;
        commentSection.prepend(div);
    }

    // Ecoute temps réel sur la collection 'comments', triée par timestamp décroissant
    const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
        commentSection.innerHTML = '';
        snapshot.forEach(doc => renderComment(doc));
    });

    // Escape HTML pour éviter les injections
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Envoi du commentaire
    submitBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const content = document.getElementById('commentContent').value.trim();
        if (!username || !content) return alert("Merci de remplir tous les champs.");

        try {
            await addDoc(collection(db, "comments"), {
                username,
                content,
                timestamp: serverTimestamp()
            });
            document.getElementById('username').value = '';
            document.getElementById('commentContent').value = '';
        } catch (error) {
            console.error("Erreur lors de l'envoi du commentaire :", error);
        }
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
