require.config({
    baseUrl: "/static/js/",
    urlArgs: 'cb=' + Math.random(),
    paths: {
        text:'libs/text',
        domReady:'libs/domReady',
        underscore:'libs/underscore',
        // Backbone.js library
        Backbone:'libs/backbone',
        marionette: 'libs/backbone.marionette.min',
        leaflet: 'libs/leaflet/leaflet',
        'leaflet-draw': 'libs/leaflet/leaflet.draw',
        backbone_paginator: 'libs/backbone.paginator',
        backbone_nested: 'libs/backbone-nested-v1.1.2.min',
        jquery:'libs/jquery-1.8.3.min',
        moment: 'libs/moment.min',
        select2: 'libs/select2/select2',
        jasmine: 'libs/jasmine-1.3.1/jasmine',
        'jasmine-html': 'libs/jasmine-1.3.1/jasmine-html',
        'jasmine-require': 'libs/jasmine-1.3.1/jasmine-require',
        spec: 'tests/spec/'
    },
    shim: {
        jquery: {
            exports: '$'
        },
        moment: {
            exports: 'moment'
        },
        select2: {
            deps: ['jquery'],
            exports: '$'
        },
        nouislider: {
            deps: ['jquery'],
            exports: '$'
        },
        leaflet: {
            exports: 'L'
        },
        'leaflet-draw': {
            deps: ['leaflet'],
            exports: 'L'
        },
        underscore: {
            exports: "_"
        },
        Backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
	    backbone_paginator : {
		    deps:['Backbone']
	    },
        backbone_nested: {
            deps:['Backbone'],
            exports: 'Backbone'
        },
        marionette: {
            deps:['Backbone'],
            exports: 'Marionette'
        },
        jasmine: {
            exports: 'jasmine'
        },
        'jasmine-html': {
            deps: ['jasmine', 'jasmine-require'],
            exports: 'jasmine'
        },

    }
});

require(['underscore', 'jquery', 'jasmine-html'], function(_, $, jasmine){
 
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function(spec) {
        return htmlReporter.specFilter(spec);
    };

    var specs = [];
    specs.push('spec/collections/PlacesSpec')


    $(function(){
        require(specs, function(){
            jasmineEnv.execute();
        });
    });
 
});

