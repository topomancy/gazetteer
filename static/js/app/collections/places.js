define(['Backbone','app/models/place', 'app/core/mediator', 'backbone_paginator'], function(Backbone, Place, mediator) {

    var Places = Backbone.Paginator.requestPager.extend({
        'model': Place,
        'paginator_core': {
            'type': 'GET',
            'url': '/1.0/place/search.json?',
            'dataType': 'json'
        },
        'paginator_ui': {
            'firstPage': 1,
            'currentPage': 1,
            'perPage': 50,
//            'sort': '',
//            'q': '',
//            'feature_type': '',
//            'bbox': '',
//            'start_date': '',
//            'end_date': ''
        },
        'server_api': {
//            'q': function() { return this.options.q },
//            'q': '',
//            'feature_type': '',
//            'bbox': '',
//            'start_date': '',
//            'end_date': '',
            'page': function() { return this.currentPage; }
        },
//        'initialize': function(models, options) {
//            Backbone.Paginator.requestPager.prototype.initialize.apply(this, arguments);
//            //console.log(this);
//            this.options = options;
//            console.log(options);
////            this.server_api.q = options.q || '';
////            this.server_api.feature_type = options.feature_type || null;
////            this.server_api.bbox = options.bbox || null;
////            this.server_api.start_date = options.start_date || null;
////            this.server_api.end_date = options.end_date || null;
////            console.log(this.server_api);
//            return this;                
//        },
        'setServerApi': function(options) {
            this.server_api.q = options.q || '';
            this.server_api.feature_type = options.feature_type || null;
            this.server_api.bbox = options.bbox || null;
            this.server_api.start_date = options.start_date || null;
            this.server_api.end_date = options.end_date || null;
            return this;    
        },
        'parse': function(res) {
            this.currentPage = res.page;
            mediator.commands.execute("map:loadGeoJSON", res);
            //mediator.events.trigger("search:parse", res);
            return res.features;    
        }
    });
    
    return Places;

});


//define ['Backbone','cs!app/models/place','backbone_paginator'],(Backbone,Place) ->
//  class Place extends Backbone.Paginator.requestPager
//    model: Place
//    paginator_core:
//      type: 'GET'
//      url: '/1.0/search/?'
//    paginator_ui:
//      firstPage:0
//      currentPage:0
//      perPage : 50
//    server_api:
//      'sort' : '-_id'
//    parse: (res) ->
//      console.log res
//      res.items
