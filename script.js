// Initialize variables
const generateButton = document.getElementById('generate-button');
const themeToggle = document.getElementById('theme-toggle');
const editionToggle = document.getElementById('edition-toggle');
const fileNameInput = document.getElementById('file-name');
let body = document.body;

// Texture data placeholders
let blockTextures = {}; // Replace with actual data
let itemTextures = {}; // Replace with actual data
let paintingTextures = []; // Replace with actual data

// Edition toggle functionality
let isJavaEdition = true;

editionToggle.addEventListener('click', () => {
    if (isJavaEdition) {
        editionToggle.textContent = "Switch to Java Edition";
        isJavaEdition = false; // Now Bedrock Edition is active
    } else {
        editionToggle.textContent = "Switch to Bedrock Edition";
        isJavaEdition = true; // Now Java Edition is active
    }
});

// Function to handle texture generation based on the selected edition
generateButton.addEventListener('click', function () {
    const zip = new JSZip();
    let texturesFolder;

    // Depending on the edition, choose the folder structure
    if (isJavaEdition) {
        texturesFolder = zip.folder("assets/minecraft/textures");
    } else {
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
