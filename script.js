function loadItems() {
    const type = document.getElementById('typeSelection').value;
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    const availableItems = ['diamond_sword', 'wooden_sword', 'stick'];
    const availableBlocks = ['diamond_block', 'wooden_planks', 'obsidian'];

    const options = type === 'items' ? availableItems : type === 'blocks' ? availableBlocks : [];
    
    options.forEach(option => {
        let div = document.createElement('div');
        div.textContent = option.replace(/_/g, ' ').toUpperCase();
        div.classList.add('item-option');
        div.onclick = () => alert('Selected ' + option);
        itemList.appendChild(div);
    });

    let futureMessage = document.createElement('div');
    futureMessage.textContent = "More items and blocks coming soon!";
    futureMessage.classList.add('future-message');
    itemList.appendChild(futureMessage);
}

function loadImage(event) {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    let reader = new FileReader();

    reader.onload = function() {
        let img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function loadPackIcon(event) {
    let file = event.target.files[0];
    if (file && file.type === 'image/png') {
        let reader = new FileReader();
        reader.onload = function() {
            let img = new Image();
            img.onload = function() {
                document.querySelector('#packIconPreview').src = img.src;
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a PNG file.');
    }
}

function clearCanvas() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function downloadPack() {
    let packName = document.getElementById('packName').value.trim();
    let fileName = document.getElementById('fileName').value.trim();
    let description = document.getElementById('packDescription').value.trim();

    if (!packName || !fileName) {
        alert('Please fill out the pack name and file name.');
        return;
    }

    let canvas = document.getElementById('canvas');
    let imageData = canvas.toDataURL('image/png');

    let zip = new JSZip();
    let imgFolder = zip.folder('textures');
    let metaFolder = zip.folder('manifest');

    // Add the canvas image to the zip
    imgFolder.file('texture.png', imageData.split(',')[1], {base64: true});

    // Add a simple manifest.json
    metaFolder.file('manifest.json', JSON.stringify({
        "format_version": "1.10",
        "header": {
            "description": description || "Minecraft Bedrock Texture Pack",
            "name": packName,
            "uuid": generateUUID(),
            "version": [1, 0, 0],
            "min_engine_version": [1, 16, 0]
        },
        "modules": [
            {
                "description": description || "Minecraft Bedrock Texture Pack",
                "type": "data",
                "uuid": generateUUID(),
                "version": [1, 0, 0]
            },
            {
                "description": description || "Minecraft Bedrock Texture Pack",
                "type": "resource",
                "uuid": generateUUID(),
                "version": [1, 0, 0]
            }
        ]
    }, null, 2));

    // Generate the zip and download
    zip.generateAsync({type: 'blob'}).then(function(content) {
        let downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(content);
        downloadLink.download = `${fileName}.mcpack.zip`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    });
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
      }
