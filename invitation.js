// Configuration du script Google Sheets Web App
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby1tbaC9MZfPGuklnIQSlkk2IywKkWzoxsgtlmnCIN8G96UI4v36XHuK3BZrV6bxvfu/exec';
document.addEventListener('DOMContentLoaded', () => {
    const seal = document.getElementById('introBtn');
    const screen = document.getElementById('introScreen');
    const main = document.getElementById('mainContent');

    // 1. APPARITION PROGRESSIVE DE L'ENVELOPPE AU CHARGEMENT
    setTimeout(() => {
        if (screen) {
            screen.classList.add('ready');
        }
    }, 500);

    if (seal && screen && main) {
        seal.addEventListener('click', () => {
            // Force le retour en haut
            window.scrollTo({ top: 0, behavior: 'instant' });

            // 2. DISPARITION DU SCEAU
            seal.style.opacity = '0';
            seal.style.transform = 'scale(1.2)';

            // 3. OUVERTURE DES PORTES
            setTimeout(() => {
                screen.classList.add('open');
                document.body.classList.remove('locked');

                // 4. RÉVÉLATION ÉCHELONNÉE DU CONTENU (Instantané pour éviter l'écran blanc)
                setTimeout(() => {
                    main.classList.add('revealed');

                    const heroElements = main.querySelectorAll('.hero-premium .fade-in-up');
                    heroElements.forEach((el, index) => {
                        setTimeout(() => {
                            el.classList.add('is-visible');
                        }, 250 * index); // 250ms pour un enchaînement fluide
                    });
                }, 50); // Presque immédiat

                setTimeout(() => {
                    screen.style.display = 'none';
                }, 2000);
            }, 400);
        });
    }

    // Force le retour en haut au chargement de la page
    window.onload = () => {
        window.scrollTo(0, 0);
    };

    // --- ENVOI RSVP & VALIDATION ---
    const rsvpForm = document.getElementById('rsvpForm');
    const successMsg = document.getElementById('successMessage');

    if (rsvpForm) {
        const radios = document.querySelectorAll('input[name="attendance"]');
        const guestCountGroup = document.getElementById('guestCountGroup');

        radios.forEach(r => {
            r.addEventListener('change', () => {
                if (guestCountGroup) {
                    guestCountGroup.style.display = (r.value === 'oui' && r.checked) ? 'block' : 'none';
                    const guestsSelect = document.getElementById('guests');
                    if (guestsSelect) {
                        guestsSelect.required = (r.value === 'oui' && r.checked);
                    }
                }
            });
        });

        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const presence = document.querySelector('input[name="attendance"]:checked');
            if (!presence) {
                alert("Veuillez indiquer votre présence.");
                return;
            }

            const btn = rsvpForm.querySelector('.btn');
            const originalBtnText = btn.innerText;
            btn.disabled = true;
            btn.innerText = "ENVOI EN COURS...";

            // Récupération sécurisée des valeurs pour éviter le crash si un élément est absent du DOM
            const allergiesInput = document.getElementById('allergies');
            const messageInput = document.getElementById('message');
            const guestsSelect = document.getElementById('guests');

            const data = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                attendance: presence.value,
                guests: guestsSelect && presence.value === 'oui' ? guestsSelect.value : '1',
                allergies: allergiesInput ? allergiesInput.value : 'Aucune',
                message: messageInput ? messageInput.value : ''
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data)
            }).then(() => {
                // Animation fluide de transition entre formulaire et message de succès
                rsvpForm.style.transition = 'opacity 0.5s ease';
                rsvpForm.style.opacity = '0';
                setTimeout(() => {
                    rsvpForm.style.display = 'none';
                    if (successMsg) {
                        successMsg.style.display = 'block';
                        successMsg.style.opacity = '0';
                        successMsg.style.transition = 'opacity 0.8s ease';
                        setTimeout(() => {
                            successMsg.style.opacity = '1';
                        }, 50);
                    }
                }, 500);
            }).catch((err) => {
                console.error("Erreur lors de la soumission RSVP:", err);
                alert("Une erreur est survenue lors de l'enregistrement de votre réponse. Veuillez réessayer.");
                btn.disabled = false;
                btn.innerText = originalBtnText;
            });
        });
    }

    // --- INTERSECTION OBSERVER POUR LES ANIMATIONS AU DÉFILEMENT ---
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    // On observe tous les éléments avec la classe fade-in-up sauf ceux du hero (déjà gérés au clic du sceau)
    document.querySelectorAll('.fade-in-up').forEach(el => {
        if (!el.closest('.hero-premium')) {
            io.observe(el);
        }
    });

    // --- LOGIQUE COMPTE À REBOURS ---
    const targetDate = new Date('October 23, 2026 15:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const countdownContainer = document.getElementById('countdown');
        if (!countdownContainer) return;

        if (distance < 0) {
            countdownContainer.innerHTML = "<div class='grand-jour'>C'est le grand jour ! ✨</div>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (daysEl) daysEl.innerText = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.innerText = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.innerText = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.innerText = seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
});
