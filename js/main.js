const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navOverlay = document.getElementById('navOverlay');

function closeMobileMenu() {
    if (!hamburger || !navMenu || !navOverlay) return;
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (hamburger && navMenu && navOverlay) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navOverlay.addEventListener('click', closeMobileMenu);
}

const navLinks = document.querySelectorAll('.nav-link');
const sectionLinks = document.querySelectorAll('.nav-link[href^="#"]');
const sections = document.querySelectorAll('section[id]');

navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });
});

sectionLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const target = targetId ? document.querySelector(targetId) : null;

        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

const scrollObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const id = entry.target.getAttribute('id');
            sectionLinks.forEach((link) => {
                const isActive = link.getAttribute('href') === `#${id}`;
                link.classList.toggle('active', isActive);
            });
        });
    },
    {
        threshold: 0.35,
        rootMargin: '0px 0px -40% 0px'
    }
);

sections.forEach((section) => scrollObserver.observe(section));

const revealTargets = document.querySelectorAll('.project-card, .skill-item, .education-card, .others-card, .contact-item');
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    }
);

revealTargets.forEach((target) => {
    target.classList.add('reveal-up');
    revealObserver.observe(target);
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitButton = this.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Message Sent!';
        submitButton.style.backgroundColor = '#79b8ff';
        submitButton.style.borderColor = '#79b8ff';

        this.reset();

        window.setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.style.backgroundColor = '';
            submitButton.style.borderColor = '';
        }, 2200);
    });
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});
