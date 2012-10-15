from pyelasticobjects import *
import json

#make this more django model friendly?
#Place.objects.get(123) for example
class PlaceManager():
    
    #http://www.djangobook.com/en/2.0/chapter10.html see
    #Place.objects.name_count('Leeds')
    #counts number of times an object with the specified name included
    def name_count(self, keyword):
        print self
        return None


class Place():

    conn = ObjectSearch('http://localhost:9200/') 

    objects = PlaceManager()

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

    #Place.search("search term")
    @classmethod
    def search(self):
        return None

    #gets the specified place as a Place object
    #Place.get(123)
    #maybe should be more django Place.objects.get(123) ?
    @classmethod
    def get(obj_id):
        return None 


    def get_name(self, name):
        #conn = ObjectSearch('http://localhost:9200/')
        docs = self.conn.search("name:"+ name)
        if docs[0].source:
            return docs[0].source
        return None
        
    def set_name(self, name):
        #conn = ObjectSearch('http://localhost:9200/')
        self.conn.index("dummy-index", "user", {"name": name}, 1)
        self.conn.refresh(["dummy-index"])
        
    #I want this to be a class method Place.count  which would count all places.
    def count(self, n):
        #conn = ObjectSearch('http://localhost:9200/')
        return self.conn.count("*").count
