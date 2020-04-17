const {app, shell, webContents} = require('electron');

exports.about = function() {
    shell.openExternal('https://support.google.com/meet/');
}

exports.mic = function() {
    webContents.getAllWebContents().forEach( (wc) => { wc.send('application-mic-toggle') } );
}

exports.cam = function() {
    webContents.getAllWebContents().forEach( (wc) => { wc.send('application-cam-toggle') } );
}

exports.muteAll = function() {
    webContents.getAllWebContents().forEach( (wc) => { wc.send('application-mute-all') } );
}

exports.quit = function() {
    app.quit();
}
