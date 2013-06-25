/*
    Maps URLs to function calls defined in controller.js
*/

define(['marionette', 'app/core/controller'], function(Marionette, GazController) {
    var router = Marionette.AppRouter.extend({
        controller: GazController,
        appRoutes: {
            '': 'home',
            'search': 'search',
            'detail/:id': 'detail',
            'detail/:id/:tab': 'detail'
        }
    });
    return router;
});
