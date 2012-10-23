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
    
    #gets the history and revisions of a record
    #{'index': u'gazetteer-history', 'exists': True, 'source': {u'index': u'gazetteer', u'type': u'place', u'id': u'09fc1d1d82127c1d', u'revisions': [{u'user_created': u'unknown', #u'created_at': 1351003898.2357221, u'digest': u'274651d248387cdfef909c72aaa2538e24e8499b'}]}, 'version': 1, 'type': u'place', 'id': u'09fc1d1d82127c1d'}
    def history(self, place):
        results = self.conn.history(self.index, self.doc_type, place.id) #history index is self.index+"-history" i.e. gazetteer-history
        return {"place": results.id, "version": results.version, "revisions": results["revisions"]}
    
    #gets a place by passing in a specified revision digest 
    def revision(self, revision_digest):
        return None
        
    #compare two place revisions
    def diff(self, digest1, digest2):
        return None
        
    #rollbacks a place to the target revision    
    def rollback(self, target_revision):
        return None
    

    #returns the heirarchy of this object
    def heirarchy(self, place):
        return None

    
    #saves a place with metadata about the save
    #metatdata"user_created": "Jane J. Editor"
    def save(self, place, metadata={"user_created": "unknown"}):
        if place.id:
            json = place.to_json()
            self.conn.index(self.index, self.doc_type, json, place.id, metadata=metadata)
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
        
        
    #returns straight json from this object    
    def to_json(self):
        json = {}
        for attr in self.__slots__:
            json[attr] = getattr(self, attr)
        return json

    #gets geojson document from this place
    def to_geojson(self):
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

