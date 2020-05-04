const {app, BrowserWindow, shell} = require('electron');
const path = require('path')

const menu = require('./menu.js');
const touchbar = require('./touchbar.js');
const tray = require('./tray.js');
const meet = require('./meet.js');

let mainWindow = null;

if (app.commandLine.hasSwitch('help')) {
    console.log("Usage:");
    console.log("  --room-id=<id>  - Connect to the given room")
    console.log("  --disable-tray  - Disable the tray bar icon");
    console.log("  --help          - Show this help");
    process.exit(0);
}

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        icon: tray.getIcon(false),
        width: 1280,
        height: 800,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'browser.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    let url = 'https://meet.google.com/';
    if (app.commandLine.hasSwitch('room-id')) {
        url = 'https://meet.google.com/' + app.commandLine.getSwitchValue('room-id')
    }

    menu.init(meet);
    mainWindow.loadURL(url);
    mainWindow.setTouchBar(touchbar.init(meet));

    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
    });

    mainWindow.webContents.on('new-window', function(event, url, frameName, disposition, options) {
        event.preventDefault();
        shell.openExternal(url);
    });


    if (!app.commandLine.hasSwitch('disable-tray')) {
        // Minimize window to system tray
        mainWindow.on('minimize',function(event){
            event.preventDefault()
            mainWindow.hide()
        })

        tray.init(
            meet,
            () => {
                if (mainWindow.isVisible()) {
                    mainWindow.hide()
                } else {
                    mainWindow.show()
                    mainWindow.focus()
                }
            }
        );
    }
});
