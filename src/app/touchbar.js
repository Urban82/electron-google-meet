const {Menu, ipcMain, TouchBar, nativeImage} = require('electron');
const {TouchBarSpacer, TouchBarButton} = TouchBar;

function getColor(isMuted) {
    let selectedColor = '#ff0000';
    let defaultColor = '#363636';
    return (isMuted) ? selectedColor : defaultColor;
}

exports.init = function(meet) {
    let quitButton = new TouchBarButton({
        label: 'Leave and quit',
        icon: nativeImage.createFromPath(__dirname + '/icons/ic_call_end.png'),
        iconPosition: 'left',
        click: meet.quit
    });
    let micButton = new TouchBarButton({
        icon: nativeImage.createFromPath(__dirname + '/icons/ic_mic_off.png'),
        iconPosition: 'overlay',
        backgroundColor: getColor(false),
        click: meet.mic
    });
    let camButton = new TouchBarButton({
        icon: nativeImage.createFromPath(__dirname + '/icons/ic_videocam_off.png'),
        iconPosition: 'overlay',
        backgroundColor: getColor(false),
        click: meet.cam
    });
    let muteAllButton = new TouchBarButton({
        label: 'Mute All',
        backgroundColor: getColor(false),
        click: meet.muteAll
    });

    let touchBar = new TouchBar([
        quitButton,
        new TouchBarSpacer({size: 'flexible'}),
        micButton,
        camButton,
        new TouchBarSpacer({size: 'flexible'}),
        muteAllButton
    ]);

    ipcMain.on('application-mic-change', (event, arg) => {
        micButton.backgroundColor = getColor(arg);
    });
    ipcMain.on('application-cam-change', (event, arg) => {
        camButton.backgroundColor = getColor(arg);
    });

    return touchBar;
}
