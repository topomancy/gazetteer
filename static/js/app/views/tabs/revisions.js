define(['Backbone', 'marionette', 'underscore', 'app/core/mediator', 'text!app/views/tabs/revisions.tpl'], function(Backbone, Marionette, _, mediator, template) {


    var RevisionView = Marionette.ItemView.extend({
        tagName: 'li',
        template: _.template(template),
        events: {
            'click .revert': 'revert',
            'click .viewDiff': 'viewDiff'
        },
        hideRevert: function() {
            this.$el.find('.revert').hide();
        },
        revert: function(e) {
            e.preventDefault();
            var that = this;
            require(['app/helpers/modal'], function(modalHelper) {
                var revision = that.model;
                console.log("revision", revision);
                var place = mediator.requests.request("getCurrentPlace");
                modalHelper.showModal("revert", {
                    'revision': revision,
                    'place': place
                });
            });
        },
        viewDiff: function(e) {
            e.preventDefault();
        }
        
    }); 

    var RevisionsView = Marionette.CollectionView.extend({
        tagName: 'ol',
        className: 'reverseOrderedList smallFont',
        itemView: RevisionView,
        onRender: function() {
            if (this.children.length > 0) {
                var lastItem = this.children.last();
                lastItem.hideRevert();   
            }
        }
    });

    return RevisionsView;
}); 
