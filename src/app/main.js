const {app, BrowserWindow, Tray, Menu, shell} = require('electron');
const path = require('path')

const menu = require('./menu.js');
const touchbar = require('./touchbar.js');
const meet = require('./meet.js');

let mainWindow = null;
let tray = null;

if (app.commandLine.hasSwitch('help')) {
    console.log("Usage:");
    console.log("  --room-id=<id>  - Connect to the given room")
    console.log("  --disable-tray  - Disable the tray bar icon");
    console.log("  --help          - Show this help");
    process.exit(0);
}

app.on('ready', () => {
    let icon = path.join(__dirname, 'icons/meet.png');
    if (process.platform == "win32") {
        icon = path.join(__dirname, 'icons/meet.ico');
    }

    mainWindow = new BrowserWindow({
        icon: icon,
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

        tray = new Tray(icon);
        tray.setTitle('Google Meet')
        tray.setToolTip('Google Meet');
        tray.on('click', toggleWindow);
        tray.on('double-click', toggleWindow);
        const contextMenu = Menu.buildFromTemplate([
            {label: "Disable or enable camera", click: () => { meet.cam(); }},
            {label: "Mute or unmute your microphone", click: () => { meet.mic(); }},
            {type: "separator"},
            {role: "quit"}, // "role": system prepared action menu
        ]);
        tray.setContextMenu(contextMenu)
    }
});

const toggleWindow = () => {
    if (mainWindow.isVisible()) {
        mainWindow.hide()
    } else {
        mainWindow.show()
        mainWindow.focus()
    }
}
