const blockFileInput = document.getElementById('blockFileInput');
const itemFileInput = document.getElementById('itemFileInput');
const paintingFileInput = document.getElementById('paintingFileInput');
const blockTypeSelect = document.getElementById('blockTypeSelect');
const itemTypeSelect = document.getElementById('itemTypeSelect');
const blockPreview = document.getElementById('blockPreview');
const itemPreview = document.getElementById('itemPreview');
const paintingPreview = document.getElementById('paintingPreview');
const downloadButton = document.getElementById('downloadButton');
const fileNameInput = document.getElementById('fileNameInput');
const themeToggle = document.getElementById('theme-toggle');
const editionToggle = document.getElementById('edition-toggle');
const body = document.body;

let blockTextures = {};
let itemTextures = {};
let paintingTextures = [];
let isJavaEdition = true; // Default is Java Edition

// Handle file uploads and previews
const handleFileUpload = (inputElement, previewElement, textureObject, textureType) => {
    previewElement.innerHTML = ''; // Clear previous preview
    const textureKey = textureType;

    const file = inputElement.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            previewElement.appendChild(img);
        };
        reader.readAsDataURL(file);
        textureObject[textureKey] = file; // Store the texture with the selected type
    }

    checkIfReadyToDownload();
};

// Check if there are any textures to enable download
const checkIfReadyToDownload = () => {
    const hasBlocks = Object.keys(blockTextures).length > 0;
    const hasItems = Object.keys(itemTextures).length > 0;
    const hasPaintings = paintingTextures.length > 0;

    downloadButton.disabled = !(hasBlocks || hasItems || hasPaintings);
};

// Block upload handler
blockFileInput.addEventListener('change', () => {
    const selectedBlockType = blockTypeSelect.value;
    handleFileUpload(blockFileInput, blockPreview, blockTextures, selectedBlockType);
});

// Item upload handler
itemFileInput.addEventListener('change', () => {
    const selectedItemType = itemTypeSelect.value;
    handleFileUpload(itemFileInput, itemPreview, itemTextures, selectedItemType);
});

// Painting upload handler
paintingFileInput.addEventListener('change', () => {
    paintingPreview.innerHTML = ''; // Clear previous preview
    paintingTextures.length = 0; // Clear the array

    Array.from(paintingFileInput.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            paintingPreview.appendChild(img);
        };
        reader.readAsDataURL(file);
        paintingTextures.push(file); // Store paintings
    });

    checkIfReadyToDownload();
});

// Handle zip file creation and download
downloadButton.addEventListener('click', () => {
    const zip = new JSZip();
    let texturesFolder;

    // Java Edition folder structure
    if (isJavaEdition) {
        texturesFolder = zip.folder("assets/minecraft/textures");
    }
    // Bedrock Edition folder structure
    else {
        texturesFolder = zip.folder("textures");
    }

    // Add block textures
    const blocksFolder = texturesFolder.folder("block");
    for (const blockType in blockTextures) {
        blocksFolder.file(`${blockType}.png`, blockTextures[blockType]);
    }

    // Add item textures
    const itemsFolder = texturesFolder.folder("item");
    for (const itemType in itemTextures) {
        itemsFolder.file(`${itemType}.png`, itemTextures[itemType]);
    }

    // Add painting textures
    const paintingsFolder = texturesFolder.folder("painting");
    paintingTextures.forEach((file, index) => {
        paintingsFolder.file(`painting_${index + 1}.png`, file);
    });

    // Get the file name from the input field
    let fileName = fileNameInput.value.trim();
    if (!fileName.endsWith(".mcpack.zip")) {
        fileName += ".mcpack.zip"; // Ensure the file has the proper extension
    }

    // Generate the zip file and prompt the user to download
    zip.generateAsync({ type: "blob" }).then(function (blob) {
        saveAs(blob, fileName);
    });
});

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
    }
});

// Edition toggle functionality
editionToggle.addEventListener('click', () => {
    if (isJavaEdition) {
        editionToggle.textContent = "Switch to Java Edition";
        isJavaEdition = false;
    } else {
        editionToggle.textContent = "Switch to Bedrock Edition";
        isJavaEdition = true;
    }
});
