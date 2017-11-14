const {ipcRenderer} = require('electron');

ipcRenderer.on('application-mic-toggle', function() {
	document.querySelector('[data-capture-type="mic"] [role="button"]').click();
});

ipcRenderer.on('application-cam-toggle', function() {
	document.querySelector('[data-capture-type="cam"] [role="button"]').click();
});