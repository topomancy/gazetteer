from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

import api_urls

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'gazetteer.views.home', name='home'),
    # url(r'^gazetteer/', include('gazetteer.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'gazetteer.views.index'), 
    url(r'^search/', 'gazetteer.views.search'),
    url(r'^feature/(?P<place_id>.+)/$', 'gazetteer.views.detail', name='detail'),
    url(r'^feature/(?P<place_id>.+)/edit$', 'gazetteer.views.edit_place', name='edit_place'),
    url(r'^1.0/place/', include(api_urls)),
)





