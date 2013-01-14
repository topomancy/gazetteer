from settings import *

#
# Settings file for use with the tests, so that they use sqlite and a custom ES index
#

DATABASES['default'] = {'ENGINE': 'django.db.backends.sqlite3'}
ELASTICSEARCH["default"]["INDEX"] = "gaz-test-index"
