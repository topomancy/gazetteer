require.config({
    paths:{
        // RequireJS plugin
        text:'libs/text',
        // RequireJS plugin
        domReady:'libs/domReady',
        // underscore library
        underscore:'libs/underscore',
        // Backbone.js library
        Backbone:'libs/backbone',
        //'coffee-script':'libs/coffee-script',
		backbone_paginator: 'libs/backbone.paginator',
		//cs: 'libs/cs',
        // jQuery
        jquery:'libs/jquery-1.8.3.min'
    },
    shim:{
        Backbone:{
            deps:['underscore', 'jquery'],
            exports:'Backbone'
        },
		backbone_paginator : {
			deps:['Backbone']
		},
        underscore:{
            exports:'_'
        },
//		cs: {
//			deps:['coffee-script']
//		},
		jquery : {
			exports:'$'
		}
    }
});

require(["app/main"],function(){

});
