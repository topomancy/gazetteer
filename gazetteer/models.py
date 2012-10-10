from django.db import models
from pyelasticobjects import *
import json

class Dummy(models.Model):
    question = models.CharField(max_length=200)
    
    def es_search(self):
        conn = ObjectSearch('http://localhost:9200/')        
        conn.index("dummy-index", "user", {"user": "Joe Tester"}, 1)
        docs = conn.search("user:Tester")
        print docs[0].source
        conn.delete_index("dummy-index")
