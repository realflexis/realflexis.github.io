const blockFileInput = document.getElementById('blockFileInput');
const itemFileInput = document.getElementById('itemFileInput');
const paintingFileInput = document.getElementById('paintingFileInput');
const blockPreview = document.getElementById('blockPreview');
const itemPreview = document.getElementById('itemPreview');
const paintingPreview = document.getElementById('paintingPreview');
const downloadButton = document.getElementById('downloadButton');
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

let blockTextures = [];
let itemTextures = [];
let paintingTextures = [];

// Handle file uploads and previews
const handleFileUpload = (inputElement, previewElement, textureArray) => {
    previewElement.innerHTML = '';
    textureArray.length = 0; // Clear the array

    Array.from(inputElement.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            previewElement.appendChild(img);
        };
        reader.readAsDataURL(file);
        textureArray.push(file);
    });

    downloadButton.disabled = !(blockTextures.length || itemTextures.length || paintingTextures.length);
};

blockFileInput.addEventListener('change', () => handleFileUpload(blockFileInput, blockPreview, blockTextures));
itemFileInput.addEventListener('change', () => handleFileUpload(itemFileInput, itemPreview, itemTextures));
paintingFileInput.addEventListener('change', () => handleFileUpload(paintingFileInput, paintingPreview, paintingTextures));

// Handle zip file creation and download
downloadButton.addEventListener('click', () => {
    const zip = new JSZip();
    const texturesFolder = zip.folder("assets/minecraft/textures");

    // Add block textures
    const blocksFolder = texturesFolder.folder("block");
    blockTextures.forEach(file => {
        blocksFolder.file(file.name, file);
    });

    // Add item textures
    const itemsFolder = texturesFolder.folder("item");
    itemTextures.forEach(file => {
        itemsFolder.file(file.name, file);
    });

    // Add painting textures
    const paintingsFolder = texturesFolder.folder("painting");
    paintingTextures.forEach(file => {
        paintingsFolder.file(file.name, file);
    });

    // Generate the zip file
    zip.generateAsync({ type: 'blob' })
        .then((content) => {
            saveAs(content, 'minecraft-texture-pack.zip');
        });
});

// Toggle between light and dark modes
themeToggle.addEventListener('click', () => {
    // Toggle light mode class on body
    body.classList.toggle('light-mode');
    
    // Change button text based on current mode
    if (body.classList.contains('light-mode')) {
        themeToggle.textContent = 'Toggle Dark Mode';
    } else {
        themeToggle.textContent = 'Toggle Light Mode';
    }
});
