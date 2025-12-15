// ===================================
// DRYWALL COMPANY - PREMIUM INTERACTIONS
// ===================================

// === FORCE SCROLL TO TOP ON RELOAD ===
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

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
    // Update logo (Disabled to prefer hardcoded HTML)
    // const logoElement = document.querySelector('.logo');
    // if (logoElement) {
    //     if (config.logo.image) {
    //         logoElement.innerHTML = `<img src="${config.logo.image}" alt="${config.logo.text}">`;
    //     } else {
    //         logoElement.textContent = config.logo.text;
    //     }
    // }

    // Update hero content
    const heroSubtitle = document.querySelector('.hero-content .subtitle');
    const heroTitle = document.querySelector('.hero-content h1');
    const heroDescription = document.querySelector('.hero-content p');

    if (heroSubtitle) heroSubtitle.textContent = config.heroContent.subtitle;
    if (heroTitle) heroTitle.textContent = config.heroContent.title;
    if (heroDescription) heroDescription.textContent = config.heroContent.description;

    // Update Philosophy Section
    if (config.philosophy) {
        const philSection = document.querySelector('.philosophy');
        if (philSection) {
            philSection.querySelector('.subtitle').textContent = config.philosophy.subtitle;
            philSection.querySelector('h2').textContent = config.philosophy.title;
            const paragraphs = philSection.querySelectorAll('p:not(.subtitle)');
            if (paragraphs[0]) paragraphs[0].innerHTML = config.philosophy.text1; // Allow HTML for bolding
            if (paragraphs[1]) paragraphs[1].innerText = config.philosophy.text2;

            const highlights = philSection.querySelectorAll('.highlight-item');
            if (config.philosophy.highlights) {
                config.philosophy.highlights.forEach((item, index) => {
                    if (highlights[index]) {
                        highlights[index].querySelector('h3').textContent = item.title;
                        highlights[index].querySelector('p').textContent = item.text;
                    }
                });
            }
        }
    }

    // Update Portfolio Section
    if (config.portfolioSection) {
        const portSection = document.querySelector('.portfolio');
        if (portSection) {
            portSection.querySelector('.subtitle').textContent = config.portfolioSection.subtitle;
            portSection.querySelector('h2').textContent = config.portfolioSection.title;

            // Rebuild Portfolio Grid
            const portGrid = portSection.querySelector('.portfolio-grid');
            if (portGrid && config.portfolioSection.items) {
                portGrid.innerHTML = ''; // Clear existing
                config.portfolioSection.items.forEach(item => {
                    // Only add if title or image is present
                    if (item.title || item.image) {
                        const div = document.createElement('div');
                        div.className = 'portfolio-item fade-in';
                        div.innerHTML = `
                            <img src="${item.image || 'images/portfolio-1.jpg'}" alt="${item.title}" loading="lazy">
                            <div class="portfolio-item-overlay">
                                <h3>${item.title}</h3>
                                <p>${item.desc}</p>
                            </div>
                        `;
                        // Re-attach hover event listeners effectively (since we verify listeners on page load, 
                        // but dynamic elements need new ones. We'll delegate or re-run listener logic)
                        div.addEventListener('mouseenter', function () { this.style.zIndex = '10'; });
                        div.addEventListener('mouseleave', function () { this.style.zIndex = '1'; });

                        // Observe for fade-in
                        observer.observe(div);
                        portGrid.appendChild(div);
                    }
                });
            }
        }
    }

    // Update Services Section
    if (config.servicesSection) {
        const servSection = document.querySelector('.services');
        if (servSection) {
            servSection.querySelector('.subtitle').textContent = config.servicesSection.subtitle;
            servSection.querySelector('h2').textContent = config.servicesSection.title;

            // Rebuild Services Grid
            const servGrid = servSection.querySelector('.services-grid');
            if (servGrid && config.servicesSection.items) {
                servGrid.innerHTML = '';
                config.servicesSection.items.forEach(item => {
                    if (item.title) {
                        const div = document.createElement('div');
                        div.className = 'service-card fade-in';
                        div.innerHTML = `
                            <h3>${item.title}</h3>
                            <p>${item.desc}</p>
                        `;
                        observer.observe(div);
                        servGrid.appendChild(div);
                    }
                });
            }
        }
    }

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
            facebook: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
            instagram: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
            linkedin: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h5v-8.306c0-4.613 6.115-4.954 6.115 0v8.306h5v-10.375c0-6.704-7.946-6.491-9.974-3.46v-2.165z"/></svg>',
            whatsapp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>'
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
                link.className = 'social-icon-link';
                link.innerHTML = socialIcons[platform];
                link.setAttribute('aria-label', platform);

                link.addEventListener('mouseenter', () => {
                    link.style.transform = 'translateY(-3px)';
                });

                link.addEventListener('mouseleave', () => {
                    link.style.transform = 'translateY(0)';
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

// Modal Elements
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');

// Close modal logic
closeModal.addEventListener('click', () => {
    successModal.classList.remove('active');
});

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
    }
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Create FormData object from the form
    const formData = new FormData(contactForm);

    fetch("https://formsubmit.co/ajax/drywall.labpy@gmail.com", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Show custom modal instead of alert
            successModal.classList.add('active');
            contactForm.reset();
            // Scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al enviar el mensaje. Por favor, intente nuevamente o contáctenos por WhatsApp.');
        })
        .finally(() => {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
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
