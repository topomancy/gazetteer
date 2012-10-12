from pyelasticobjects import *
import json

class Place():
    
    
    def get_name(self, name):
        conn = ObjectSearch('http://localhost:9200/')
        docs = conn.search("name:"+ name)
        if docs[0].source:
            return docs[0].source
        return None
        
    def set_name(self, name):
        conn = ObjectSearch('http://localhost:9200/')
        conn.index("dummy-index", "user", {"name": name}, 1)
        conn.refresh(["dummy-index"])
        
    
    def count(self, n):
        conn = ObjectSearch('http://localhost:9200/')
        return conn.count("*").count
