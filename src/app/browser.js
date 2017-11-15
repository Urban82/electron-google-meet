const {ipcRenderer} = require('electron');

function isMuted(htmlElement) {
	return ('true' === htmlElement.dataset['isMuted'].toLowerCase());
}

ipcRenderer.on('application-mic-toggle', function() {
	let micButtonElement = document.querySelector('[data-capture-type="mic"] [role="button"]');
	ipcRenderer.send('application-mic-change', !isMuted(micButtonElement));
	micButtonElement.click();
});

ipcRenderer.on('application-cam-toggle', function() {
	let camButtonElement = document.querySelector('[data-capture-type="cam"] [role="button"]');
	ipcRenderer.send('application-cam-change', !isMuted(camButtonElement));
	camButtonElement.click();
});