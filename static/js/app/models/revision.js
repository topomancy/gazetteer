define(['Backbone', 'app/settings'], function(Backbone, settings) {

    var Revision  = Backbone.Model.extend({

        initialize: function() {
            var model_id = this.get('model_id');
            var digest = this.get('digest');
            this.set('revisionURL', settings.api_base + 'place/' + model_id + '/' + digest + ".json");     
        }

    });

    return Revision;
});
