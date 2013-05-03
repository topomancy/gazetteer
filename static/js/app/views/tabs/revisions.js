define(['Backbone', 'marionette', 'underscore', 'app/core/mediator', 'text!app/views/tabs/revisions.tpl'], function(Backbone, Marionette, _, mediator, template) {


    var RevisionView = Marionette.ItemView.extend({
        tagname: 'li',
        template: _.template(template),
        events: {
            'click .revert': 'revert',
            'click .viewDiff': 'viewDiff'
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
        tagName: 'ul',
        className: 'reverseOrderedList',
        itemView: RevisionView
    });

    return RevisionsView;
}); 
