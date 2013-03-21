require.config({
    baseUrl: "/static/js/",
    urlArgs: 'cb=' + Math.random(),
    paths: {
    // underscore library
        underscore:'libs/underscore',
        // Backbone.js library
        Backbone:'libs/backbone',
        marionette: 'libs/backbone.marionette.min',

        backbone_paginator: 'libs/backbone.paginator',
        jquery:'libs/jquery-1.8.3.min',
        jasmine: 'libs/jasmine-1.3.1/jasmine',
        'jasmine-html': 'libs/jasmine-1.3.1/jasmine-html',
        'jasmine-require': 'libs/jasmine-1.3.1/jasmine-require',
        spec: 'tests/spec/'
    },
    shim: {
        jquery: {
            exports: '$'
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
//    specs.push('spec/models/TodoSpec');
//    specs.push('spec/views/ClearCompletedSpec');
//    specs.push('spec/views/CountViewSpec');
//    specs.push('spec/views/FooterViewSpec');
//    specs.push('spec/views/MarkAllSpec');
//    specs.push('spec/views/NewTaskSpec');
//    specs.push('spec/views/TaskListSpec');
//    specs.push('spec/views/TaskViewSpec');


    $(function(){
        require(specs, function(){
            jasmineEnv.execute();
        });
    });
 
});

