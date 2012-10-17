from django.conf.urls import patterns, include, url

urlpatterns = patterns('gazetteer.api_views',
    url(r'^search.json$', 'search', name='search_json'),
    url(r'(?P<id>[a-z0-9]*?)\.json$', 'place_json', name='place_json'),

)
