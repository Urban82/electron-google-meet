const {ipcMain, Tray, Menu} = require('electron');
const path = require('path')

function getIcon(isMuted) {
    let iconName = "meet";
    if (isMuted)
        iconName = "meet-mute";

    let icon = path.join(__dirname, 'icons', iconName + '.png');
    if (process.platform == "win32") {
        icon = path.join(__dirname, 'icons', iconName + '.ico');
    }
    return icon;
}

exports.init = function(meet, toggleWindow) {
    tray = new Tray(getIcon(false));

    tray.setTitle('Google Meet');
    tray.setToolTip('Google Meet');
    tray.on('click', toggleWindow);
    tray.on('double-click', toggleWindow);
    const contextMenu = Menu.buildFromTemplate([
        {label: "Disable or enable camera", click: () => { meet.cam(); }},
        {label: "Mute or unmute your microphone", click: () => { meet.mic(); }},
        {type: "separator"},
        {role: "quit"}, // "role": system prepared action menu
    ]);
    tray.setContextMenu(contextMenu);

    ipcMain.on('application-mic-change', (event, arg) => {
        tray.setImage(getIcon(arg));
    });

    return tray;
}

exports.getIcon = getIcon;
