define(['marionette', 'app/core/controller'], function(Marionette, GazController) {
    var router = Marionette.AppRouter.extend({
        controller: GazController,
        appRoutes: {
            '': 'home',
            'search:queryParams': 'search',
            'detail/:id': 'detail',
            'detail/:id/:tab': 'detail'
        }
    });
    return router;
});
