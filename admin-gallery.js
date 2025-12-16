// GALLERY LOGIC
let galleryItems = [];

function toggleGalleryInput() {
    const type = document.getElementById('galleryInputType').value;
    document.getElementById('galleryUrlInput').style.display = type === 'url' ? 'block' : 'none';
    document.getElementById('galleryFileInput').style.display = type === 'file' ? 'block' : 'none';
}

function loadGalleryIntoAdmin(config) {
    galleryItems = config.gallery || [];
    renderGalleryList();
}

function renderGalleryList() {
    const list = document.getElementById('galleryList');
    if (!list) return;
    list.innerHTML = '';
    if (galleryItems.length === 0) {
        list.innerHTML = '<p>No hay imágenes.</p>';
        return;
    }
    galleryItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'gallery-admin-item';
        div.innerHTML = `<div style='display:flex; gap:10px; margin-bottom:10px; border:1px solid #ddd; padding:5px;'>
            <img src='${item.url}' style='width:50px; height:50px; object-fit:cover;'>
            <div style='flex:1'>Img ${index + 1}<br><small>${item.caption || ''}</small></div>
            <button onclick='removeGalleryItem(${index})' class='btn-danger'>X</button>
        </div>`;
        list.appendChild(div);
    });
}

function removeGalleryItem(index) {
    if (confirm('Delete?')) {
        galleryItems.splice(index, 1);
        renderGalleryList();
    }
}

function getGalleryConfig() {
    return galleryItems;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('addGalleryItemBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            const type = document.getElementById('galleryInputType').value;
            const caption = document.getElementById('galleryCaption').value;
            if (type === 'url') {
                const url = document.getElementById('galleryUrl').value;
                if (url) {
                    galleryItems.push({ url, caption });
                    renderGalleryList();
                    document.getElementById('galleryUrl').value = '';
                }
            } else {
                const fileInput = document.getElementById('galleryFile');
                if (fileInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        galleryItems.push({ url: e.target.result, caption });
                        renderGalleryList();
                        fileInput.value = '';
                    };
                    reader.readAsDataURL(fileInput.files[0]);
                }
            }
        });
    }
});
