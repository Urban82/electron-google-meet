const {Menu} = require('electron');

var template = require('./menus/' + process.platform + '.json');

exports.init = function(meet) {
	function bindCommands(items) {
	    items.forEach((item) => {
			if (item.submenu) {
	        	bindCommands(item.submenu);
	      	} else {
		        if (item.command === "application:about") {
					item.click = meet.about;
			  	} else if (item.command === "application:mic") {
					item.click = meet.mic;
			  	} else if (item.command === "application:cam") {
					item.click = meet.cam;
			  	}
	      	}
	    });
	}
	
	bindCommands(template);
	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
}