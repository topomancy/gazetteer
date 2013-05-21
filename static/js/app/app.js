define([
    'Backbone',
    'marionette',
    'jquery',
    'app/settings',
    'app/views/map',
    'app/views/search',
    'app/views/header',
    'app/views/navigation',
    'app/core/router',
    'app/core/mediator',
    'app/helpers/search',
    'app/helpers/ajax',
    'app/collections/origins',
    'app/collections/selectedplaces',
    'app/views/layouts/selectedplaces'
    ], function(
    Backbone,
    Marionette,
    $,
    settings,
    MapView,
    SearchView,
    HeaderView,
    NavigationView,
    GazRouter,
    mediator,
    searchHelper,
    ajaxHelper,
    Origins,
    SelectedPlaces,
    SelectedPlacesLayout
    ) {

    var app = new Marionette.Application({
        views: {},
        models: {},
        collections: {},
        user: {},
        ui_state: {
            'resultsScroll': 0,
            'resultsXHR': null
        },
        helpers: {
            'search': searchHelper
        },
        mediator: mediator
    });

    app.addRegions({
        'map': '#mapBlock',
        'search': '#searchBlock',
        'navTabs': '#tabNavigation',
        'results': '#mainResultsContent',
        'placeDetail': '#placeDetailContent',
        'selectedPlaces': '#selectedPlacesContent',
        'modal': '#lightBoxContent'
        //'results': '#resultsBlock'
    });
    
    app.on('initialize:after', function() {
        $.getJSON("/user_json", {}, function(response) {
            app.user = response.user;
            _.extend(settings, response.settings);
            app.collections.origins = new Origins(settings.origins);
            app.views.search = new SearchView().render();
            app.views.header = new HeaderView();
            app.views.navigation = new NavigationView();
            app.collections.selectedPlaces = new SelectedPlaces();
            app.views.selectedPlaces = new SelectedPlacesLayout({'selectedCollection': app.collections.selectedPlaces});
            app.selectedPlaces.show(app.views.selectedPlaces);
            app.views.map = new MapView().render();
            ajaxHelper.setupAjax(); //set csrf token headers
            app.router = new GazRouter();
            $('#loadingPage').hide();
            Backbone.history.start();
        });
    });

    
    return app;
});
