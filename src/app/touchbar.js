const {Menu, ipcMain, TouchBar, nativeImage} = require('electron');
const {TouchBarSpacer, TouchBarButton} = TouchBar;
//var template = require('./menus/' + process.platform + '.json');

function getColor(isMuted) {
	let selectedColor = '#ed5e59';
	let defaultColor = '#363636';
	return (isMuted) ? selectedColor : defaultColor;
}

exports.init = function(meet) {
	function bindCommands(items) {
	    items.forEach((item) => {
			if (item.submenu) {
	        	bindCommands(item.submenu);
	      	} else {
		        if (item.command === "application:about") {
					item.click = meet.about;
			  	}
	      	}
	    });
	}
	//bindCommands(template);
	
	let quitButton = new TouchBarButton({
		label: 'Leave and quit',
		icon: nativeImage.createFromPath(__dirname + '/icons/ic_call_end_3x.png'),
		iconPosition: 'left',
		click: meet.quit
	});
	let micButton = new TouchBarButton({
		icon: nativeImage.createFromPath(__dirname + '/icons/ic_mic_off_3x.png'),
		iconPosition: 'overlay',
		click: meet.mic
	});
	let camButton = new TouchBarButton({
		icon: nativeImage.createFromPath(__dirname + '/icons/ic_videocam_off_3x.png'),
		iconPosition: 'overlay',
		click: meet.cam
	});
	
	let touchBar = new TouchBar([
		quitButton,
		new TouchBarSpacer({size: 'flexible'}),
		micButton,
		new TouchBarSpacer({size: 'large'}),
		camButton,
		new TouchBarSpacer({size: 'flexible'})
	]);
	
	ipcMain.on('application-mic-change', (event, arg) => {
		micButton.backgroundColor = getColor(arg);
	});
	ipcMain.on('application-cam-change', (event, arg) => {
		camButton.backgroundColor = getColor(arg);
	});
	
	return touchBar;
}