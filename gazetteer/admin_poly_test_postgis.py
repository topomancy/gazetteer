from django.core.management import setup_environ
from django.contrib.gis.geos import GEOSGeometry
import settings
import itertools
setup_environ(settings)

from gazetteer.models import FeatureCode
from gazetteer.models import AdminBoundary

from gazetteer.place import *

es_settings = settings.ELASTICSEARCH["default"]
conn = ElasticHistory(es_settings["HOST"], timeout=120)
index = es_settings["INDEX"]
doc_type = es_settings["DOC_TYPE"]

usa = AdminBoundary.objects.get(name="United States")

filter = {
        "not" : {
            "term": {"feature_code" :"ADM0"}
    }
}

query_term = "*"
query = {'size' : 10000,
        'query': {
            "filtered": {
                "query" : {
                     'query_string': {
                            'default_operator' : 'AND',
                            'query': query_term
                            }
                },
                "filter": filter
            }}
        }

results = conn.search(query, index=index, doc_type=doc_type)

print "took: ", results.took
print "count: ", len(results.hits["hits"])
hits = results.hits["hits"]

count = 0
for hit in hits:
    count = count + 1
    centroid = hit.source["centroid"]
    #print hit.source["name"]
    place_geometry = GEOSGeometry(json.dumps(hit.source["geometry"])) 
    contains_results = AdminBoundary.objects.filter(geom__contains=place_geometry)
    for iresult in contains_results:
        if iresult.name != "United States":
            print count, hit.source["name"], iresult.uuid, iresult.name
            


