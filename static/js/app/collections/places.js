define(['Backbone','app/models/place','backbone_paginator'], function(Backbone, Place) {

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
            'perPage': 50
        },
        'server_api': {
            'q': '',
            'feature_type': '',
            'bbox': '',
            'page': 1,
        },
        'parse': function(res) {
            this.currentPage = res.page;
            console.log(res.features);
            console.log(res.features.length);
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
