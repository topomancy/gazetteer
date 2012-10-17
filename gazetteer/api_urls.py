from django.conf.urls import patterns, include, url

urlpatterns = patterns('gazetteer.api_views',
    url(r'(?P<id>[a-z0-9]*?)\.json$', 'place_json', name='place_json'),
    
)
