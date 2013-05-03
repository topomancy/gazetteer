require.config({
    urlArgs: 'cb=' + Math.random(),
    waitSeconds: 45,
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
        // leaflet.js
        leaflet: 'libs/leaflet/leaflet',

		backbone_paginator: 'libs/backbone.paginator',

        //deal with nested properties in model: https://github.com/afeld/backbone-nested/
        backbone_nested: 'libs/backbone-nested-v1.1.2.min',
        // jQuery
        jquery:'libs/jquery-1.8.3.min'
    },
    shim:{
        leaflet: {
            exports: 'L'
        },
        Backbone:{
            deps:['underscore', 'jquery'],
            exports:'Backbone'
        },
		backbone_paginator : {
			deps:['Backbone'],
            exports: 'Backbone'
		},
        backbone_nested: {
            deps:['Backbone'],
            exports: 'Backbone'
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

require(["app/app", "domReady"],function(app, domReady){
    domReady(function() {
        app.start();
        window.$G = app;
    });
});
