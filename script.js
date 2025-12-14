// ===================================
// DRYWALL COMPANY - PREMIUM INTERACTIONS
// ===================================

// === LOAD CONFIGURATION ===
function loadSiteConfig() {
    // Try localStorage first (if admin made changes), otherwise use config.json
    const savedConfig = localStorage.getItem('drywallConfig');

    if (savedConfig) {
        const config = JSON.parse(savedConfig);
        applyConfig(config);
    } else {
        // Load from config.json as fallback
        fetch('config.json')
            .then(response => response.json())
            .then(config => {
                applyConfig(config);
            })
            .catch(error => {
                console.error('Error loading config:', error);
            });
    }
}

function applyConfig(config) {
    // Update logo
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
        if (config.logo.image) {
            logoElement.innerHTML = `<img src="${config.logo.image}" alt="${config.logo.text}" style="height: 2rem;">`;
        } else {
            logoElement.textContent = config.logo.text;
        }
    }

    // Update hero content
    const heroSubtitle = document.querySelector('.hero-content .subtitle');
    const heroTitle = document.querySelector('.hero-content h1');
    const heroDescription = document.querySelector('.hero-content p');

    if (heroSubtitle) heroSubtitle.textContent = config.heroContent.subtitle;
    if (heroTitle) heroTitle.textContent = config.heroContent.title;
    if (heroDescription) heroDescription.textContent = config.heroContent.description;

    // Update hero images
    const heroSlides = document.querySelectorAll('.hero-slide img');
    if (heroSlides[0] && config.images.hero1) heroSlides[0].src = config.images.hero1;
    if (heroSlides[1] && config.images.hero2) heroSlides[1].src = config.images.hero2;

    // Update portfolio images
    const portfolioItems = document.querySelectorAll('.portfolio-item img');
    if (portfolioItems[0] && config.images.portfolio1) portfolioItems[0].src = config.images.portfolio1;
    if (portfolioItems[1] && config.images.portfolio2) portfolioItems[1].src = config.images.portfolio2;
    if (portfolioItems[2] && config.images.portfolio3) portfolioItems[2].src = config.images.portfolio3;
    if (portfolioItems[3] && config.images.portfolio4) portfolioItems[3].src = config.images.portfolio4;

    // Add social media links to footer if they don't exist
    addSocialMediaLinks(config.socialMedia);

    // Update contact info in footer if exists
    updateContactInfo(config.contact);
}

function addSocialMediaLinks(socialMedia) {
    const footer = document.querySelector('.footer .container');

    // Check if social links already exist
    if (!document.querySelector('.social-links')) {
        const socialLinksDiv = document.createElement('div');
        socialLinksDiv.className = 'social-links';
        socialLinksDiv.style.cssText = 'display: flex; gap: 1.5rem; justify-content: center; margin-bottom: 1rem;';

        const socialIcons = {
            facebook: '📘',
            instagram: '📸',
            linkedin: '💼',
            whatsapp: '💬'
        };

        Object.keys(socialMedia).forEach(platform => {
            if (socialMedia[platform]) {
                const link = document.createElement('a');
                let href = socialMedia[platform];

                // Format WhatsApp link
                if (platform === 'whatsapp') {
                    href = `https://wa.me/${socialMedia[platform].replace(/\D/g, '')}`;
                }

                link.href = href;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.cssText = 'color: var(--color-champagne-gold); font-size: 1.5rem; transition: transform 0.3s ease;';
                link.innerHTML = socialIcons[platform];
                link.setAttribute('aria-label', platform);

                link.addEventListener('mouseenter', () => {
                    link.style.transform = 'scale(1.2)';
                });

                link.addEventListener('mouseleave', () => {
                    link.style.transform = 'scale(1)';
                });

                socialLinksDiv.appendChild(link);
            }
        });

        footer.insertBefore(socialLinksDiv, footer.firstChild);
    }
}

function updateContactInfo(contact) {
    const footer = document.querySelector('.footer .container');

    // Check if contact info already exists
    if (!document.querySelector('.contact-info')) {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-info';
        contactDiv.style.cssText = 'margin-bottom: 1rem; font-size: 0.875rem;';

        if (contact.phone || contact.email) {
            contactDiv.innerHTML = `
        ${contact.phone ? `<span>📞 ${contact.phone}</span>` : ''}
        ${contact.phone && contact.email ? ' | ' : ''}
        ${contact.email ? `<span>📧 ${contact.email}</span>` : ''}
      `;

            const existingP = footer.querySelector('p');
            footer.insertBefore(contactDiv, existingP);
        }
    }
}

// Load config when page loads
window.addEventListener('DOMContentLoaded', loadSiteConfig);

// === NAVIGATION SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// === MOBILE MENU TOGGLE ===
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// === HERO SLIDER ===
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Change slide every 5 seconds
setInterval(nextSlide, 5000);

// === SMOOTH SCROLL FOR NAVIGATION ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// === SCROLL FADE-IN ANIMATIONS ===
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// === CONTACT FORM HANDLING ===
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        project: document.getElementById('project').value
    };

    // In a real implementation, you would send this to a server
    console.log('Form submitted:', formData);

    // Show success message
    alert('Gracias por su interés. Un miembro de nuestro equipo se pondrá en contacto pronto para programar su Consulta de Diseño Privada.');

    // Reset form
    contactForm.reset();
});

// === PORTFOLIO ITEM HOVER ENHANCEMENT ===
const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function () {
        this.style.zIndex = '10';
    });

    item.addEventListener('mouseleave', function () {
        this.style.zIndex = '1';
    });
});

// === PREVENT FLASH OF UNSTYLED CONTENT ===
window.addEventListener('load', () => {
    document.body.style.opacity = '1';

    // Trigger initial fade-in for hero content
    setTimeout(() => {
        document.querySelector('.hero-content').classList.add('visible');
    }, 300);
});

// === PERFORMANCE: LAZY LOAD IMAGES ===
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// === PARALLAX EFFECT ON SCROLL (SUBTLE) ===
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroSlides = document.querySelectorAll('.hero-slide img');

            heroSlides.forEach(slide => {
                slide.style.transform = `translateY(${scrolled * 0.3}px)`;
            });

            ticking = false;
        });

        ticking = true;
    }
});

// === PRELOAD NEXT HERO IMAGE ===
function preloadImages() {
    slides.forEach((slide, index) => {
        if (index !== 0) {
            const img = slide.querySelector('img');
            const imageUrl = img.src;
            const preloadLink = document.createElement('link');
            preloadLink.href = imageUrl;
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            document.head.appendChild(preloadLink);
        }
    });
}

// Preload after initial load
window.addEventListener('load', preloadImages);
