from pyelastichistory import *
from django.conf import settings
import json

class PlaceManager:

    def __init__(self):
        es_settings = settings.ELASTICSEARCH["default"]
        self.conn = ElasticHistory(es_settings["HOST"])
        self.index = es_settings["INDEX"]
        self.doc_type = es_settings["DOC_TYPE"]


    #counts number of times an object with the specified keyword
    #Place.objects.name_count("dam")
    #Place.objects.name_count("*")
    def count(self, keyword="*"):
        return self.conn.count(keyword).count

    #searches - returns a dict of the search hits
    #search query to be in the form: "user:Tester" is user is desired, for example. bbox format [min_x, min_y, max_x, max_x]
    #returns a dict with totals, max_score and a places list containing matching Places 
    def search(self, query_term, bbox=None):
        filter = {}
        if bbox:
            top_left = [bbox[0], bbox[3]]
            bottom_right = [bbox[2], bbox[1]]
            filter = { 
                        "geo_bounding_box": {
                            "place.centroid": {
                                "top_left": top_left,
                                "bottom_right": bottom_right                              
                         }}
                         }
                      
        query = { 'size' : 100,
                'query': {
                    "filtered": {
                        "query" : {
                             'query_string': {'query': query_term}
                        },
                        "filter": filter
                    }}
            }
        results = self.conn.search(query, index=self.index, doc_type=self.doc_type)
        
        places = []
        if len(results.hits["hits"]) > 0:
            for result in results.hits["hits"]:
                result.source['id'] = result.id
                places.append(Place(result.source))
            
        return {"total": results.hits["total"], "max_score": results.hits["max_score"], "places": places}  

    #gets the specified place as a Place object
    #Place.objects.get("0908d08a995ab874")
    def get(self, obj_id):
        doc = self.conn.get(self.index, self.doc_type, obj_id)
        items = doc.items()  #a list of tuples
        items.append( ("id",doc.id) ) #add the id to this list, and cast to a dict to make a new place
        return Place(dict(items))

    #returns similar objects
    def find_similar(self, place):
        results = self.conn.more_like_this(self.index, self.doc_type, place.id, ['name'], min_term_freq=1, min_doc_freq=1)
        places = []
        if len(results.hits["hits"]) > 0:
            for result in results.hits["hits"]:
                result.source['id'] = result.id
                places.append(Place(result.source))
            
        return {"total": results.hits["total"], "max_score": results.hits["max_score"], "places": places}

    #returns the heirarchy of this object
    def heirarchy(self, place):
        return None


    #Adds a new place record to elastic search backend
    def add(self, place):
        return None


    #ElasticSearch index methods

    #adds an index (new record) directly to ES via json
    def index(self, place_json):
        return None

    #creates index with mapping    
    def create_mapping(self, mapping_json):
        return None

    #refreshes the ES index
    def refresh_index():
        return None

class Place:

    objects = PlaceManager()
    
    __slots__ = ['id', 'name', 'centroid','geometry','is_primary','updated','feature_code', 'uris', 'relationships', 'timeframe']

    #creates a new Place object 
    def __init__(self, attributes_dict=None):
        if attributes_dict:
            for attr, val in attributes_dict.items():
                setattr(self, attr, val)
                   
    def __repr__(self):
        return "<%s (%s)>" % (self.__class__, self.__dict__)

    #saves the new / changed object
    def save(self):
        #calls Place.objects.save(self) or something?
        return None

    #gets geojson document from this place
    def to_json(self):
        d = self.geometry
        d['properties'] = {
            'id': self.id,
            'name': self.name,
            'is_primary': self.is_primary,
            'feature_code': self.feature_code,
            'uris': self.uris
        }
        return d
        

    def find_similar(self):
        return Place.objects.find_similar(self)

