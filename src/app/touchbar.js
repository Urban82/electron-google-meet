const {Menu} = require('electron');

//var template = require('./menus/' + process.platform + '.json');

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
}