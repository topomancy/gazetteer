from django.conf.urls import patterns, include, url

urlpatterns = patterns('gazetteer.api_views',
    url(r'^search.json$', 'search', name='search_json'),
    
    url(r'(?P<id>[0-9a-f]{16})\.json$', 'place_json', name='place_json'), #FIXME: better regexp to match id
    url(r'(?P<id>[0-9a-f]{16})/similar.json', 'similar_json', name='similar_json'),    

)
