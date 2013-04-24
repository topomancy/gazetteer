define(['Backbone'], function(Backbone) {

    var AlternateName = Backbone.Model.extend({

        initialize: function() {
            if (typeof(this.type) == 'undefined') {
                this.set('type', false);
            }
        }

    });

    return AlternateName;
});
