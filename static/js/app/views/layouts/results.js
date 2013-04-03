define(['Backbone', 'marionette', 'underscore', 'jquery', 'text!app/views/layouts/results.tpl'], function(Backbone, Marionette, _, $, template) {
    var ResultsLayout = Marionette.Layout.extend({
        template: _.template(template),
        regions: {
            'places': '#resultsBlock',
            'pagination': '#paginationBlock'
        }
    });

    return ResultsLayout;
});
