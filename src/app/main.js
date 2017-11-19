const {app, BrowserWindow} = require('electron');

const menu = require('./menu.js');
const touchbar = require('./touchbar.js');
const meet = require('./meet.js');

let mainWindow;

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 800,
		titleBarStyle: 'hidden',
	    webPreferences: {
			preload: __dirname + '/browser.js'
	    }
	});
  
	menu.init(meet);
	mainWindow.loadURL('https://meet.google.com/');
	mainWindow.setTouchBar(touchbar.init(meet));
  
	mainWindow.on('closed', function () {
    	mainWindow = null;
		app.quit();
	});
});
