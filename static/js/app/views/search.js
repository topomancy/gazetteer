define(['marionette', 'Backbone', 'jquery', 'app/core/mediator', 'app/helpers/search'], function(Marionette, Backbone, $, mediator, searchHelper) {
    var SearchView = Marionette.ItemView.extend({
        //template: _.template(mapTemplate),
        el: '#searchBlock',
        ui: {
            'form': '#searchForm',
            'q': '#q',
            'start_date': '#start_date',
            'end_date': '#end_date',
            'searchInBBox': '#searchInBBox',
            'applySearch': '#applySearch',
            'cancelSearch': '#cancelSearch',
            'resetSearch': '#resetSearch'
        },
        events: {
            'submit #searchForm': 'submitSearch',
            'click #applySearch': 'submitSearch',
            'keypress #q': 'formKeypress'
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

        formKeypress: function(e) {
            console.log(e.keyCode);
            if (e.keyCode == 13) {
                this.submitSearch(e);
            }
        },

        getSearchParams: function() {
            var that = this;
            return {
                q: that.ui.q.val(),
                start_date: that.ui.start_date.val(),
                end_date: that.ui.end_date.val(),
                searchInBBox: that.ui.searchInBBox.is(":checked")
            };
        },
        setSearchParams: function(obj) {
            this.ui.q.val(obj.q);
            this.ui.start_date.val(obj.start_date);
            this.ui.end_date.val(obj.end_date);
            if (obj.bbox) {
                this.ui.searchInBBox.attr("checked", "checked");
            } else {
                this.ui.searchInBBox.removeAttr("checked");
            }
            return this;
        }
    });        
    
    return SearchView;
});
