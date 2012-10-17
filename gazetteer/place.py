from pyelastichistory import *
from django.conf import settings
import json

class PlaceManager:

    def __init__(self):
        es_settings = settings.ELASTICSEARCH["default"]
        self.conn = ElasticHistory(es_settings["HOST"])
        self.index = es_settings["INDEX"]
        self.doc_type = es_settings["DOC_TYPE"]


    #counts number of times an object with the specified keyword somewhere included
    #Place.objects.name_count("dam")
    #Place.objects.name_count("*")
    def count(self, keyword="*"):
        return self.conn.count(keyword).count

    #Place.objects.search("search term")
    #searches - returns a dict of the search hits
    #search query to be in the form: "user:Tester" is user is desired, for example
    #bbox [min_x, min_y, max_x, max_y]
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
                      
        query = {
                'query': {
                    "filtered": {
                        "query" : {
                             'query_string': {'query': query_term}
                        },
                        "filter": filter
                    }}
            }

        return self.conn.search(query, index=self.index, doc_type=self.doc_type)

    #gets the specified place as a Place object
    #Place.objects.get("0908d08a995ab874")
    def get(self, obj_id):
        return self.conn.get(self.index, self.doc_type, obj_id) 

    #returns similar objects
    def find_similar(self, place):
        return None

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

    #creates a new Place object 
    def __init__(self):
        return None

    #saves the new / changed object
    def save(self):
        #calls Place.objects.save(self) or something?
        return None

    #gets json document from this place
    def to_json(self):
        return None

    def find_similar(self):
        #call Place.objects.find_similar(self)
        return None

    

