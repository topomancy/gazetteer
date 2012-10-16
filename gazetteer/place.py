from pyelasticobjects import *
import json

#INDEX="gazetteer"
#TYPE="place"

class PlaceManager:

    def __init__(self, conn=None):
        self.conn = conn

    #counts number of times an object with the specified keyword somewhere included
    #Place.objects.name_count("dam")
    #Place.objects.name_count("*")
    def count(self, keyword="*"):
        return self.conn.count(keyword).count

    #Place.objects.search("search term")
    #searches - returns a dict of the search hits
    #search query to be in the form: "user:Tester" is user is desired, for example
    def search(self, query):
        return self.conn.search(query)

    #gets the specified place as a Place object
    #Place.objects.get("0908d08a995ab874")
    def get(self, obj_id):
        return self.conn.get("gazetteer", "place", obj_id) 

class Place:

    conn = ObjectSearch('http://localhost:9200/') 
    objects = PlaceManager(conn)

    #gets json document from this place, by passing in the Place object itself
    #or by passing in the id of the document
    @classmethod
    def extract_document(obj_id, obj=None):
        return None

    #creates index with specified index name and tye    
    @classmethod
    def create_index(index_name, es_type):
        return None

    #Adds record to ES index
    @classmethod
    def index():
        return None

    #refreshes the ES index
    @classmethod
    def refresh_index():
        return None

