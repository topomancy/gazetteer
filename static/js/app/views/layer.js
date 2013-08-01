define(['Backbone', 'marionette', 'underscore', 'text!app/views/layer.tpl'], function(Backbone, Marionette, _, template) {

    var LayerView = Marionette.ItemView.extend({
        template: _.template(template),
        tagName: 'li',
        initialize: function() {
            this.render();
           
        },
        render: function(){
            this.$el.html( this.template(this.model.toJSON()));
        }

    });

    return LayerView;
});