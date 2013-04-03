define(['marionette', 'Backbone', 'jquery', 'app/core/mediator', 'app/helpers/search'], function(Marionette, Backbone, $, mediator, searchHelper) {
    var SearchView = Marionette.ItemView.extend({
        //template: _.template(mapTemplate),
        el: '#searchBlock',
        ui: {
            'form': '#searchForm',
            'q': '#q',
            'start_date': '#start_date',
            'end_date': '#end_date'
        },
        events: {
            'submit #searchForm': 'submitSearch'
        },

        initialize: function() {
            this.bindUIElements();
        },
/*
        initialize: function() {
            console.log("searchview initialized");
            var that = this;
            mediator.events.on("test:event", function() {
                console.log("search view received test event");
            });
//            mediator.events.on("search:beforeFetch", function(searchParams) {
//                console.log("search view received search:beforeFetch with ", searchParams);
//                if (that.isSearchTrigger) {
//                    that.isSearchTrigger = false;
//                    return;
//                }
//                that.setSearchParams(searchParams);
//            });
        },
*/
        submitSearch: function(e) {
            //var that = this;
            e.preventDefault();
            //var searchParams = this.getSearchParams();
            //this.isSearchTrigger = true;
            mediator.commands.execute("search:submit");
        },
        getSearchParams: function() {
            var that = this;
            return {
                q: that.ui.q.val(),
                start_date: that.ui.start_date.val(),
                end_date: that.ui.end_date.val()
            }
        },
        setSearchParams: function(obj) {
            this.ui.q.val(obj.q);
            this.ui.start_date.val(obj.start_date);
            this.ui.end_date.val(obj.end_date);
            return this;
        }
    });        
    
    return SearchView;
});
