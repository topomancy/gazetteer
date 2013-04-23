define(['Backbone', 'marionette', 'jquery', 'app/views/map', 'app/views/search', 'app/views/header', 'app/core/router', 'app/core/mediator', 'app/helpers/search'], function(Backbone, Marionette, $, MapView, SearchView, HeaderView, GazRouter, mediator, searchHelper) {

    var app = new Marionette.Application({
        views: {},
        models: {},
        collections: {},
        helpers: {
            'search': searchHelper
        },
        mediator: mediator
    });

    app.addRegions({
        'map': '#mapBlock',
        'search': '#searchBlock',
        'content': '#mainContentBlock',
        'modal': '#lightBoxContent'
        //'results': '#resultsBlock'
    });
    
    app.on('initialize:after', function() {
        app.views.map = new MapView().render();
        app.views.search = new SearchView();
        app.views.header = new HeaderView();
        this.router = new GazRouter();
        Backbone.history.start();
    });   
    
    return app;
});
