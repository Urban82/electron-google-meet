const {app, BrowserWindow, Tray, Menu} = require('electron');
const path = require('path')

const menu = require('./menu.js');
const touchbar = require('./touchbar.js');
const meet = require('./meet.js');

let mainWindow = null;
let tray = null;

app.on('ready', () => {
    if (app.commandLine.hasSwitch('help')) {
        console.log("Usage:");
        console.log("  --disable-tray  - Disable the tray bar icon");
        app.quit();
    }

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

    menu.init(meet);
    mainWindow.loadURL('https://meet.google.com/');
    mainWindow.setTouchBar(touchbar.init(meet));

    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit();
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
