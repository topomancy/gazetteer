define(['Backbone', 'marionette', 'require'], function(Backbone, Marionette, require) {
    var events = new Backbone.Wreqr.EventAggregator(),
        commands = new Backbone.Wreqr.Commands(),
        requests = new Backbone.Wreqr.RequestResponse();

    return {
        'events': events,
        'commands': commands,
        'requests': requests
    }

}); 
