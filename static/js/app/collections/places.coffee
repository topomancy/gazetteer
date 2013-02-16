define ['Backbone','cs!app/models/place','backbone_paginator'],(Backbone,Place) ->
  class Place extends Backbone.Paginator.requestPager
    model: Place
    paginator_core:
      type: 'GET'
      url: '/1.0/search/?'
    paginator_ui:
      firstPage:0
      currentPage:0
      perPage : 50
    server_api:
      'sort' : '-_id'
    parse: (res) ->
      console.log res
      res.items
