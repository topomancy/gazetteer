({
    baseUrl: ".",
    paths:{
        text:'libs/text',
        domReady:'libs/domReady',
        underscore:'libs/underscore',
        Backbone:'libs/backbone',
        marionette: 'libs/backbone.marionette.min',
        leaflet: 'libs/leaflet/leaflet',
        'leaflet-draw': 'libs/leaflet/leaflet.draw',
        moment: 'libs/moment.min',
        select2: 'libs/select2/select2',
		backbone_paginator: 'libs/backbone.paginator',
        backbone_nested: 'libs/backbone-nested-v1.1.2.min',
        jquery:'libs/jquery-1.8.3.min'
    },
    shim: {
        leaflet: {
            exports: 'L'
        },
        'leaflet-draw': {
            deps: ['leaflet'],
            exports: 'L'
        },
        Backbone:{
            deps:['underscore', 'jquery'],
            exports:'Backbone'
        },
        moment: {
            exports: 'moment'
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
		},
        select2: {
            deps: ['jquery'],
            exports: '$'
        }
    },

//    paths: {
//        jquery: "some/other/jquery"
//    },
    name: "main",
    out: "build/main.js",
    include: [
        'app/views/pagination',
        'app/views/recentplaces',
        'app/helpers/modal',
        'app/views/modals/login',
        'app/views/modals/new_place',
        'app/views/modals/revert_place',
        'app/views/modals/save_place',
        'app/views/tabs/admin_boundaries',
        'app/views/tabs/altnames',
        'app/views/tabs/relations',
        'app/views/tabs/revisions',
        'app/collections/admin_boundaries',
        'app/collections/alternate_names',
        'app/collections/existing_relations',
        'app/collections/search_relations',
        'app/collections/revisions'
    ]

})
