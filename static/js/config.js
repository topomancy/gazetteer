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
        //backbone marionette 1.0.0rc6
        marionette: 'libs/backbone.marionette.min',

		backbone_paginator: 'libs/backbone.paginator',
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
        marionette: {
            deps:['Backbone'],
            exports: 'Marionette'
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

require(["app/main"],function(app){
    window.app = app;
});
