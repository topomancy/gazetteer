define(['Backbone', 'marionette', 'underscore', 'text!app/views/layers.tpl', 'app/views/layer',], function(Backbone, Marionette, _, template, LayerView) {

    var LayersView = Marionette.ItemView.extend({
        template: _.template(template),
        tagName: 'ul',
        initialize: function() {
           // console.log("collection", this.collection);
        },
        render: function(){

            this.collection.each(function(layer){
                console.log("layer", layer);
                var layerView = new LayerView({model: layer})
                this.$el.append(layerView.el)

            }, this);
        }

    });

    return LayersView;
});
