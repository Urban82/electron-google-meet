const {app, shell, webContents} = require('electron');

exports.about = function() {
	shell.openExternal('https://support.google.com/meet/');
}

exports.mic = function() {
	webContents.getFocusedWebContents().send('application-mic-toggle');
}

exports.cam = function() {
	webContents.getFocusedWebContents().send('application-cam-toggle');
}

exports.muteAll = function() {
	webContents.getFocusedWebContents().send('application-mute-all');
}

exports.quit = function() {
	app.quit();
}