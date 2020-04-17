window.ipcRenderer = require('electron').ipcRenderer;

function isMuted(htmlElement) {
    return ('true' === htmlElement.dataset.isMuted.toLowerCase());
}

function getMicButtonElement() {
    return document.querySelector('[data-tooltip*="(ctrl + d)"]');
}

function getCamButtonElement() {
    return document.querySelector('[data-tooltip*="(ctrl + e)"]');
}

var micButtonElementStorage;
function initMicObserver(event) {
    let micButtonElement = getMicButtonElement();
    if (micButtonElement && micButtonElement !== micButtonElementStorage) {
        micButtonElementStorage = micButtonElement;
        let micObserver = new MutationObserver(function(mutations) {
            window.ipcRenderer.send('application-mic-change', isMuted(micButtonElement));
        });
        micObserver.observe(micButtonElement, {attributes: true});
    }
}

var camButtonElementStorage;
function initCamObserver(event) {
    let camButtonElement = getCamButtonElement();
    if (camButtonElement && camButtonElement !== camButtonElementStorage) {
        camButtonElementStorage = camButtonElement;
        let camObserver = new MutationObserver(function(mutations) {
            window.ipcRenderer.send('application-cam-change', isMuted(camButtonElement));
        });
        camObserver.observe(camButtonElement, {attributes: true});
    }
}

window.addEventListener('load', function() {
    document.addEventListener('click', initMicObserver, false);
    document.addEventListener('keydown', initMicObserver, false);

    document.addEventListener('click', initCamObserver, false);
    document.addEventListener('keydown', initCamObserver, false);
});

window.ipcRenderer.on('application-mic-toggle', function() {
    let micButtonElement = getMicButtonElement();
    window.ipcRenderer.send('application-mic-change', !isMuted(micButtonElement));
    micButtonElement.click();
});

window.ipcRenderer.on('application-cam-toggle', function() {
    let camButtonElement = getCamButtonElement();
    window.ipcRenderer.send('application-cam-change', !isMuted(camButtonElement));
    camButtonElement.click();
});

window.ipcRenderer.on('application-mute-all', function() {
    let micButtonElement = getMicButtonElement();
    let micMuted = isMuted(micButtonElement);
    if (!micMuted) {
        window.ipcRenderer.send('application-mic-change', !micMuted);
        micButtonElement.click();
    }

    let camButtonElement = getCamButtonElement();
    let camMuted = isMuted(camButtonElement);
    if (!camMuted) {
        window.ipcRenderer.send('application-cam-change', !camMuted);
        camButtonElement.click();
    }
});
