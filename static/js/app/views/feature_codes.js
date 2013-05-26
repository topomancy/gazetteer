define(['Backbone', 'marionette', 'underscore', 'app/views/feature_code', 'text!app/views/feature_codes.tpl'], function(Backbone, Marionette, _, FeatureCodeView, template) {
    var FeatureCodesView = Marionette.CompositeView.extend({
        template: _.template(template),
        className: 'featureCodes',
        itemView: FeatureCodeView,
        events: {
            'click': 'stopPropagation',
            'click #clearFcodes': 'clearAll'
        },
        appendHtml: function(collectionView, itemView) {
            collectionView.$(".fcodesList").append(itemView.el);
        },
        clearAll: function(e) {
            e.preventDefault();
            this.collection.clearAll();
        },
        stopPropagation: function(e) {
            e.stopPropagation();
        }
 
    });

    return FeatureCodesView;
});
