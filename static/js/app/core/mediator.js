define(['Backbone', 'marionette', 'require'], function(Backbone, Marionette, require) {
    var events = new Backbone.Wreqr.EventAggregator(),
        commands = new Backbone.Wreqr.Commands(),
        requests = new Backbone.Wreqr.RequestResponse();

    commands.addHandler("highlightPlace", function(place) {
        var app = require('app/app');
        app.views.map.highlight(place);   
    });

    commands.addHandler("unhighlightPlace", function(place) {
        var app = require('app/app');
        app.views.map.unhighlight(place);
    });

    commands.addHandler("openPlace", function(place) {
        var app = require('app/app');
        var PlaceDetailView = require("app/views/placedetail");
        console.log("openPlace", place);
        var view = new PlaceDetailView({'model': place});
        app.content.show(view); 
        app.views.map.loadPlace(place);
    });

    return {
        'events': events,
        'commands': commands,
        'requests': requests
    }

}); 
