// Load Header Include
async function loadHeader() {
    try {
        const response = await fetch('includes/header.html');
        if (response.ok) {
            const headerHTML = await response.text();
            document.getElementById('header-placeholder').innerHTML = headerHTML;

            // Set active link based on current page
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const links = document.querySelectorAll('nav a');
            links.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
        }
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Load header when page loads
loadHeader();

// Custom Audio Player Logic

document.addEventListener('DOMContentLoaded', () => {
    // Select all custom players
    const players = document.querySelectorAll('.custom-audio-player');

    // Store currently playing audio to stop others
    let currentAudio = null;
    let currentBtn = null;

    players.forEach(player => {
        const audioSrc = player.getAttribute('data-src');
        const playBtn = player.querySelector('.play-btn');
        const progressContainer = player.querySelector('.progress-container');
        const progressBar = player.querySelector('.progress-bar');
        const timeDisplay = player.querySelector('.time-display');

        // Create Audio object
        const audio = new Audio(audioSrc);

        // SVG Icons
        const playIcon = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>';
        const pauseIcon = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor"/></svg>';

        // Toggle Play/Pause
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                // Stop other players if needed
                if (currentAudio && currentAudio !== audio) {
                    currentAudio.pause();
                    if (currentBtn) currentBtn.innerHTML = playIcon;
                }

                audio.play()
                    .then(() => {
                        playBtn.innerHTML = pauseIcon;
                        currentAudio = audio;
                        currentBtn = playBtn;
                    })
                    .catch(e => console.error("Playback error:", e));
            } else {
                audio.pause();
                playBtn.innerHTML = playIcon;
            }
        });

        // Update Progress Bar & Time
        audio.addEventListener('timeupdate', () => {
            const { currentTime, duration } = audio;
            if (isNaN(duration)) return;

            const progressPercent = (currentTime / duration) * 100;
            progressBar.style.width = `${progressPercent}%`;

            // Update Time Display (MM:SS)
            let mins = Math.floor(currentTime / 60);
            let secs = Math.floor(currentTime % 60);
            if (secs < 10) secs = `0${secs}`;
            timeDisplay.textContent = `${mins}:${secs}`;
        });

        // Reset on End
        audio.addEventListener('ended', () => {
            playBtn.innerHTML = playIcon;
            progressBar.style.width = '0%';
            timeDisplay.textContent = '0:00';
        });

        // Seek functionality
        progressContainer.addEventListener('click', (e) => {
            const width = progressContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audio.duration;

            if (!isNaN(duration)) {
                audio.currentTime = (clickX / width) * duration;
            }
        });

        // Ensure duration is available for seeking if metadata loaded? 
        // Not strictly necessary for click logic as long as duration exists when clicked.
    });

    // Handle Contact Form Validation
    const form = document.querySelector('#contact-form');
    if (form) {
        const prenomInput = document.getElementById('prenom');
        const nomInput = document.getElementById('nom');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('telephone');
        const messageInput = document.getElementById('message'); // Usually message is required too? User didn't specify, but existing code had required. I will assume required.
        const submitBtn = form.querySelector('.btn-submit');

        function checkValidity() {
            const hasName = prenomInput.value.trim() !== '' && nomInput.value.trim() !== '';
            const hasContact = emailInput.value.trim() !== '' || phoneInput.value.trim() !== '';
            // Basic check for message simply being not empty if required, user didn't explicitly say "Message required" but it's a textarea... let's assume it should have something.
            // Actually existing HTML has 'required' on message.
            const hasMessage = messageInput.value.trim() !== '';

            if (hasName && hasContact && hasMessage) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        }

        const inputs = [prenomInput, nomInput, emailInput, phoneInput, messageInput];
        inputs.forEach(input => {
            if (input) input.addEventListener('input', checkValidity);
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Merci pour votre message ! (Simulation d\'envoi)');
            form.reset();
            submitBtn.disabled = true; // Reset button state
        });
    }
});