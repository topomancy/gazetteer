from settings import *

#
# Settings file for use with the tests, so that they use sqlite and a custom ES index
#
#TODO - look into using spatialite if that speeds things up?
#DATABASES['default'] = {'ENGINE': 'django.db.backends.sqlite3'}
DATABASES['default'] = {'ENGINE': 'django.contrib.gis.db.backends.postgis', 'NAME':'gazdev'}
ELASTICSEARCH["default"]["INDEX"] = "gaz-test-index"
