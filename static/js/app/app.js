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
    'app/collections/feature_codes',
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
    FeatureCodes,
    SelectedPlaces,
    SelectedPlacesLayout
    ) {

    /*
        Initialize 'app'. The app is used to keep track of current state, and holds views, collections, etc.
    */
    var app = new Marionette.Application({
        views: {},
        models: {},
        collections: {},
        user: {}, //to store the user object
        ui_state: {
            'resultsScroll': 0, //FIXME: used to track the last scroll position of the results tab, better way to do this?
            'resultsXHR': null //holds the XHR object for fetching search results, so that it can be cancelled when a new request is made.
        },
        helpers: {
            'search': searchHelper
        },
        mediator: mediator
    });

    //Setup the 'regions' of the app in containers defined in the template.
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
    
    //Perform post-init operations - setup initial views and initialize collections
    app.on('initialize:after', function() {
        var url = GAZETTEER_APP_BASE + 'user_json'; //GAZETTEER_APP_BASE is defined as a global in the template.
        $.getJSON(url, {}, function(response) { //fetch settings and user data from back-end before starting
            app.user = response.user;
            _.extend(settings, response.settings);
            app.collections.origins = new Origins(settings.origins);
            app.collections.featureCodes = new FeatureCodes(settings.featureCodes);
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
            Backbone.history.start(); //call core/controller.js to load state from the URL
        });
    });

    
    return app;
});
