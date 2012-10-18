from django.db import models
from pyelasticobjects import *
import json

from place import *

class Dummy(models.Model):
    question = models.CharField(max_length=200)
    
    def get_place(self, name):
        p = Place()
        return p.get_name(name)
        
    
    @classmethod
    def es_search(klass):
        conn = ObjectSearch('http://localhost:9200/')        
        conn.index("dummy-index", "user", {"user": "Joe Tester"}, 1)
        conn.refresh(["dummy-index"])
        docs = conn.search("user:Tester")
        
        print docs[0].source
        conn.delete_index("dummy-index")
        
