const {ipcRenderer} = require('electron');

function isMuted(htmlElement) {
	return ('true' === htmlElement.dataset.isMuted.toLowerCase());
}

function getMicButtonElement() {
	return document.querySelector('[data-capture-type="mic"] [role="button"]');
}

function getCamButtonElement() {
	return document.querySelector('[data-capture-type="cam"] [role="button"]');
}

var micButtonElementStorage;
function initMicObserver(event) {
	let micButtonElement = getMicButtonElement();
	if (micButtonElement && micButtonElement !== micButtonElementStorage) {
		micButtonElementStorage = micButtonElement;
		let micObserver = new MutationObserver(function(mutations) {
			ipcRenderer.send('application-mic-change', isMuted(micButtonElement));
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
			ipcRenderer.send('application-cam-change', isMuted(camButtonElement));
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

ipcRenderer.on('application-mic-toggle', function() {
	let micButtonElement = getMicButtonElement();
	ipcRenderer.send('application-mic-change', !isMuted(micButtonElement));
	micButtonElement.click();
});

ipcRenderer.on('application-cam-toggle', function() {
	let camButtonElement = getCamButtonElement();
	ipcRenderer.send('application-cam-change', !isMuted(camButtonElement));
	camButtonElement.click();
});

ipcRenderer.on('application-mute-all', function() {
	let micButtonElement = getMicButtonElement();
	let micMuted = isMuted(micButtonElement);
	if (!micMuted) {
		ipcRenderer.send('application-mic-change', !micMuted);
		micButtonElement.click();
	}
	
	let camButtonElement = getCamButtonElement();
	let camMuted = isMuted(camButtonElement);
	if (!camMuted) {
		ipcRenderer.send('application-cam-change', !camMuted);
		camButtonElement.click();
	}
});