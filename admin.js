// ===================================
// ADMIN PANEL LOGIC - WITH IMAGE UPLOAD
// ===================================

// Default credentials (change in production!)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

// Store uploaded images temporarily before saving
let pendingImages = {};

// ===== AUTHENTICATION =====
const loginForm = document.getElementById('loginForm');
const loginContainer = document.getElementById('loginContainer');
const adminContainer = document.getElementById('adminContainer');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        loginContainer.style.display = 'none';
        adminContainer.style.display = 'block';
        loadConfig();
        setupFileUploadListeners();
    } else {
        alert('Credenciales incorrectas. Por favor, intenta de nuevo.');
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    adminContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
    loginForm.reset();
    pendingImages = {};
});

// ===== TAB NAVIGATION =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active class from all tabs and buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding tab
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ===== LOAD CONFIGURATION =====
// ===== LOAD CONFIGURATION =====
function loadConfig() {
    // Try to load from localStorage first
    const savedConfig = localStorage.getItem('drywallConfig');

    if (savedConfig) {
        // Validation: Check if it's an empty object or just "null" string
        try {
            const config = JSON.parse(savedConfig);
            if (Object.keys(config).length === 0) throw new Error("Empty config");
            populateForm(config);
        } catch (e) {
            console.warn("Invalid local config, reloading defaults.", e);
            loadDefaults();
        }
    } else {
        loadDefaults();
    }
}

function loadDefaults() {
    fetch('config.json')
        .then(response => response.json())
        .then(config => {
            populateForm(config);
            // Save to localStorage so we start with a valid state
            localStorage.setItem('drywallConfig', JSON.stringify(config));
        })
        .catch(error => {
            console.error('Error loading config:', error);
            // Fallback object to prevent crash if json missing
            populateForm({
                siteName: 'Drywall Company',
                logo: { text: 'Drywall', image: '' },
                contact: {},
                socialMedia: {},
                images: {},
                heroContent: {},
                philosophy: {},
                portfolioSection: {},
                servicesSection: {}
            });
        });
}

// ===== POPULATE FORM =====
function populateForm(config) {
    // General
    document.getElementById('siteName').value = config.siteName || '';
    document.getElementById('logoText').value = config.logo.text || '';

    // Hero Content
    document.getElementById('heroSubtitle').value = config.heroContent.subtitle || '';
    document.getElementById('heroTitle').value = config.heroContent.title || '';
    document.getElementById('heroDescription').value = config.heroContent.description || '';

    // Contact
    document.getElementById('phone').value = config.contact.phone || '';
    document.getElementById('email').value = config.contact.email || '';
    document.getElementById('address').value = config.contact.address || '';

    // Social Media
    document.getElementById('facebook').value = config.socialMedia.facebook || '';
    document.getElementById('instagram').value = config.socialMedia.instagram || '';
    document.getElementById('linkedin').value = config.socialMedia.linkedin || '';
    document.getElementById('whatsapp').value = config.socialMedia.whatsapp || '';

    // Load images (including logo)
    const allImages = { ...config.images };
    if (config.logo.image) {
        allImages.logoImage = config.logo.image;
    }

    // Philosophy
    if (config.philosophy) {
        document.getElementById('philSubtitle').value = config.philosophy.subtitle || '';
        document.getElementById('philTitle').value = config.philosophy.title || '';
        document.getElementById('philText1').value = config.philosophy.text1 || '';
        document.getElementById('philText2').value = config.philosophy.text2 || '';
        if (config.philosophy.highlights) {
            config.philosophy.highlights.forEach((item, index) => {
                if (index < 3) {
                    document.getElementById(`philHighTitle${index + 1}`).value = item.title || '';
                    document.getElementById(`philHighText${index + 1}`).value = item.text || '';
                }
            });
        }
    }

    // Portfolio Section
    if (config.portfolioSection) {
        document.getElementById('portSubtitle').value = config.portfolioSection.subtitle || '';
        document.getElementById('portTitle').value = config.portfolioSection.title || '';
        if (config.portfolioSection.items) {
            config.portfolioSection.items.forEach((item, index) => {
                if (index < 4) {
                    document.getElementById(`portItemTitle${index + 1}`).value = item.title || '';
                    document.getElementById(`portItemDesc${index + 1}`).value = item.desc || '';
                    if (item.image) {
                        allImages[`portfolio${index + 1}`] = item.image;
                    }
                }
            });
        }
    } else {
        // Fallback for old config structure for images
        allImages.portfolio1 = config.images.portfolio1;
        allImages.portfolio2 = config.images.portfolio2;
        allImages.portfolio3 = config.images.portfolio3;
        allImages.portfolio4 = config.images.portfolio4;
    }

    // Services Section
    if (config.servicesSection) {
        document.getElementById('servSubtitle').value = config.servicesSection.subtitle || '';
        document.getElementById('servTitle').value = config.servicesSection.title || '';
        if (config.servicesSection.items) {
            config.servicesSection.items.forEach((item, index) => {
                if (index < 4) {
                    document.getElementById(`servItemTitle${index + 1}`).value = item.title || '';
                    document.getElementById(`servItemDesc${index + 1}`).value = item.desc || '';
                }
            });
        }
    }

    // Load image previews
    loadImagePreviews(allImages);

    // Initialize pending images with current config (flattened for internal logic)
    pendingImages = { ...allImages };
}

// ===== LOAD IMAGE PREVIEWS =====
function loadImagePreviews(images) {
    Object.keys(images).forEach(key => {
        const imageData = images[key];
        const previewDiv = document.getElementById(`preview-${key}`);

        if (imageData && previewDiv) {
            // Image data can be either a path or base64
            previewDiv.innerHTML = `<img src="${imageData}" alt="${key}">`;
        }
    });
}

// ===== SETUP FILE UPLOAD LISTENERS =====
function setupFileUploadListeners() {
    const fileInputs = document.querySelectorAll('input[type="file"]');

    fileInputs.forEach(input => {
        input.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file is an image
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona un archivo de imagen válido.');
                return;
            }

            // Get the image key from input id (remove 'File' suffix)
            const imageKey = this.id.replace('File', '');

            // Convert to base64
            const reader = new FileReader();
            reader.onload = function (event) {
                const base64Data = event.target.result;

                // Store in pending images
                pendingImages[imageKey] = base64Data;

                // Show preview immediately
                const previewDiv = document.getElementById(`preview-${imageKey}`);
                if (previewDiv) {
                    previewDiv.innerHTML = `<img src="${base64Data}" alt="${imageKey}">`;
                }
            };

            reader.onerror = function () {
                alert('Error al leer el archivo. Por favor intenta de nuevo.');
            };

            reader.readAsDataURL(file);
        });
    });

    // Setup clear buttons
    const clearButtons = document.querySelectorAll('.btn-clear');
    clearButtons.forEach(button => {
        button.addEventListener('click', function () {
            const imageKey = this.getAttribute('data-target');
            clearImage(imageKey);
        });
    });
}

// ===== CLEAR IMAGE =====
function clearImage(imageKey) {
    // Remove from pending images
    delete pendingImages[imageKey];

    // Clear preview
    const previewDiv = document.getElementById(`preview-${imageKey}`);
    if (previewDiv) {
        previewDiv.innerHTML = '';
    }

    // Reset file input
    const fileInput = document.getElementById(`${imageKey}File`);
    if (fileInput) {
        fileInput.value = '';
    }
}

// ===== SAVE CONFIGURATION =====
document.getElementById('saveBtn').addEventListener('click', () => {
    // Gather Portfolio Items (Text + Image)
    const portfolioItems = [];
    for (let i = 1; i <= 4; i++) {
        portfolioItems.push({
            title: document.getElementById(`portItemTitle${i}`).value,
            desc: document.getElementById(`portItemDesc${i}`).value,
            image: pendingImages[`portfolio${i}`] || ''
        });
    }

    // Gather Services
    const services = [];
    for (let i = 1; i <= 4; i++) {
        services.push({
            title: document.getElementById(`servItemTitle${i}`).value,
            desc: document.getElementById(`servItemDesc${i}`).value
        });
    }

    const config = {
        siteName: document.getElementById('siteName').value,
        logo: {
            text: document.getElementById('logoText').value,
            image: pendingImages.logoImage || ''
        },
        contact: {
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        },
        socialMedia: {
            facebook: document.getElementById('facebook').value,
            instagram: document.getElementById('instagram').value,
            linkedin: document.getElementById('linkedin').value,
            whatsapp: document.getElementById('whatsapp').value
        },
        images: {
            hero1: pendingImages.hero1 || '',
            hero2: pendingImages.hero2 || ''
        },
        heroContent: {
            subtitle: document.getElementById('heroSubtitle').value,
            title: document.getElementById('heroTitle').value,
            description: document.getElementById('heroDescription').value
        },
        philosophy: {
            subtitle: document.getElementById('philSubtitle').value,
            title: document.getElementById('philTitle').value,
            text1: document.getElementById('philText1').value,
            text2: document.getElementById('philText2').value,
            highlights: [
                { title: document.getElementById('philHighTitle1').value, text: document.getElementById('philHighText1').value },
                { title: document.getElementById('philHighTitle2').value, text: document.getElementById('philHighText2').value },
                { title: document.getElementById('philHighTitle3').value, text: document.getElementById('philHighText3').value }
            ]
        },
        portfolioSection: {
            subtitle: document.getElementById('portSubtitle').value,
            title: document.getElementById('portTitle').value,
            items: portfolioItems
        },
        servicesSection: {
            subtitle: document.getElementById('servSubtitle').value,
            title: document.getElementById('servTitle').value,
            items: services
        }
    };

    // Save to localStorage
    localStorage.setItem('drywallConfig', JSON.stringify(config));

    // Show success toast
    showToast();
});

// ===== SHOW TOAST =====
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== PREVIEW WEBSITE =====
document.getElementById('previewBtn').addEventListener('click', () => {
    window.open('index.html', '_blank');
});
