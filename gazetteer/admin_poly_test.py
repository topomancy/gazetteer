from django.core.management import setup_environ

import settings
import itertools
setup_environ(settings)

from gazetteer.models import FeatureCode
from gazetteer.place import *

es_settings = settings.ELASTICSEARCH["default"]
conn = ElasticHistory(es_settings["HOST"], timeout=120)
index = es_settings["INDEX"]
doc_type = es_settings["DOC_TYPE"]

def flatten(x):
    result = []
    for el in x:
        if hasattr(el, "__iter__") and not isinstance(el, basestring):
            result.extend(flatten(el))
        else:
            result.append(el)
    return result


p = Place.objects.get("d227a216b468aba1")

multi_polygon_list = p.geometry["coordinates"]

print len(multi_polygon_list)

or_filter_list = []

for poly in multi_polygon_list:
    polygon_list = poly[0]
    p_filter = { 
            "geo_polygon": { 
                "place.centroid": {
                    "points": polygon_list                         
             }}
           }
    or_filter_list.append(p_filter)

geo_filter = { "or": or_filter_list }

#polygon_list_t = flatten(multi_polygon_list)
#polygon_list = map(list, zip(polygon_list_t[:-1], polygon_list_t[1:]))

#print len(polygon_list)
#print polygon_list
#geo_filter = { 
            #"geo_polygon": { 
                #"place.centroid": {
                    #"points": polygon_list                         
             #}}
           #}
query_term = "*"
query = {'size' : 100000000,
        'query': {
            "filtered": {
                "query" : {
                     'query_string': {
                            'default_operator' : 'AND',
                            'query': query_term
                            }
                },
                "filter": geo_filter
            }}
        }


#print doc_type
results = conn.search(query, index=index, doc_type=doc_type)
print "took: ", results.took
print "count: ", len(results.hits["hits"])
hits = results.hits["hits"]

for hit in hits:
    
    if hit.id == "41d8d7aa02233bd7":
        print hit.id, hit.source["name"],  "HAWAII"
    if hit.id == "aa4979a28b422c69":
        print hit.id, hit.source["name"],  "HAWAII"
    if hit.id == "6c85ed6061d78b8f":
        print hit.id, hit.source["name"], "HAWAII"
    if hit.source["name"] == "Nau":
        print hit.id, hit.source["name"],  "HAWAII"
        #6c85ed6061d78b8f
    if "Makawao" in hit.source["name"]:
        print hit.id, hit.source["name"], "HAWAII"


