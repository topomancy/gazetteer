from django.conf.urls import patterns, include, url

urlpatterns = patterns('gazetteer.api_views',
    url(r'^feature_codes.json', 'feature_codes_autocomplete', name='feature_codes_json'),
    url(r'^search.json$', 'search', name='search_json'),
    url(r'^(?P<id>[0-9a-f]{16})/similar.json$', 'similar', name='similar_json'),    
    url(r'^(?P<id>[0-9a-f]{16})/hierarchy.json$', 'hierarchy', name='hierarchy_json'),
    url(r'^(?P<id>[0-9a-f]{16})/history.json$', 'history', name='history_json'),
    url(r'^(?P<id>[0-9a-f]{16})/(?P<revision>[0-9a-f]{40}).json$', 'revision', name='revision_json'),
    url(r'^(?P<id>[0-9a-f]{16})/add_relationship.json$', 'add_relationship', name='add_relationship'),
#    url(r'^(?P<id1>[0-9a-f]{16})/(?P<relationship>[a-z].*?)/(?P<id2>[0-9a-f]{16}).json$', 'add_relationship', name='add_relationship'),         
    url(r'^(?P<id>[0-9a-f]{16}).json$', 'place_json', name='place_json'),
 
)
