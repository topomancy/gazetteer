from django.utils import unittest
import json
from gazetteer.place import *

#1. edit test_settings.py if appropriate
#2. Run using " python manage.py test --settings=gazetteer.test_settings gazetteer "

class PlaceTestCase(unittest.TestCase):
    
    ## this method runs for each test case function
    def setUp(self):
        self.conn = ElasticHistory('http://localhost:9200/')
        try:
            self.conn.create_index('gaz-test-index')
        except:
            pass
            
        #add mapping
        json_mapping = open('./etl/mapping/place.json')
        mapping = json.load(json_mapping)
        self.conn.put_mapping('gaz-test-index', 'place', mapping["mappings"])
        
        #Fixtures: places geo and names changed from geonames - centroids: 1 NW. 2 SW, 3 NE, 4 SE    
        self.place_1 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "Vonasek Dam", "geometry": {"type": "Point", "coordinates": [-114.43359375, 44.033203125]}, "is_primary": true, "uris": ["geonames.org/5081200"], "feature_code": "DAM", "centroid": [-114.43359375, 44.033203125], "timeframe": {}}')
        place_id1 = "41dab90514cfc28e"
        place1 =  self.conn.index("gaz-test-index", "place", self.place_1, id=place_id1, metadata={"user_created": "test program"})
        
        self.place_2 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "Vorhees City", "geometry": {"type": "Point", "coordinates": [-114.78515625, 35.595703125]}, "is_primary": true, "uris": ["geonames.org/5081202"], "feature_code": "PPL", "centroid": [-114.78515625, 35.595703125], "timeframe": {}}')
        place_id2 = "ec82773497138a5b"
        place2 =  self.conn.index("gaz-test-index", "place", self.place_2, id=place_id2, metadata={"user_created": "test program"})
        
        self.place_3 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "Wabash Post Office (historical)", "geometry": {"type": "Point", "coordinates": [-93.8671875, 42.978515625]}, "is_primary": true, "uris": ["geonames.org/5081219"], "feature_code": "PO", "centroid": [-93.8671875, 42.978515625], "timeframe": {}}')
        place_id3 = "d957caa7c3e21ceb"
        place3 =  self.conn.index("gaz-test-index", "place", self.place_3, id=place_id3, metadata={"user_created": "test program"})
          
        self.place_4 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "Wabash Municipal Park", "geometry": {"type": "Point", "coordinates": [-88.06640625, 33.486328125]}, "is_primary": true, "uris": ["geonames.org/5081227"], "feature_code": "PRK", "centroid": [-88.06640625, 33.486328125], "timeframe": {}}')
        place_id4 = "d5dd4f6d78614061"
        place4 =  self.conn.index("gaz-test-index", "place", self.place_4, id=place_id4, metadata={"user_created": "test program"})
        
        self.conn.refresh(["gaz-test-index"]) 


    def tearDown(self):
        try:
            self.conn.delete_index("gaz-test-index")
            self.conn.delete_index("gaz-test-index-history")
        except:
            pass
            
            
    def assertResultContains(self, result, expected):
        for (key, value) in expected.items():
            self.assertEquals(value, result[key])

#PlaceManger (count, search, revision)
#some methods are wrapped covered by place test,
class PlaceMangagerTestCase(PlaceTestCase):
    
    def test_get(self):        
        place = Place.objects.get("41dab90514cfc28e")
        self.assertEqual(place.name, self.place_1["name"])

    
    @unittest.skip("simple")
    def test_count(self):
        count = Place.objects.count("*")
        self.assertEqual(count, 4)
        
    #query_term, bbox=None, start_date=None, end_date=None, per_page=100, from_index=0, page=None):
    def test_search(self):
        results = Place.objects.search("Wabash")
        self.assertEqual(len(results["places"]), 2)
        self.assertEqual(results["places"][0].name, self.place_3["name"])
        self.assertEqual(results["places"][1].name, self.place_4["name"])
        
        bbox = [-138.339843, 5.5285105, -53.964843, 61.354613]
        results = Place.objects.search("*", bbox)
        self.assertEqual(len(results["places"]), 4)
        
        bbox = [-119.4873046875, 8.7547947024356052, -77.2998046875, 41.0793511494689913]
        results = Place.objects.search("*", bbox)
        self.assertEqual(len(results["places"]), 2)
        
        bbox = [-119.4873046875, 8.7547947024356052, -77.2998046875, 41.0793511494689913]
        results = Place.objects.search("Wabash", bbox)
        self.assertEqual(len(results["places"]), 1)
        self.assertEqual(results["places"][0].name, self.place_4["name"])
        
        
    def test_get_revision(self):
        place = Place.objects.get("41dab90514cfc28e")
        history = place.history()
        first_revision_digest = history["revisions"][0]["digest"]
        revision = Place.objects.revision(place, first_revision_digest)
        self.assertEqual(place.name,  revision["place"].name)
        
        place.name = "new name"
        place.save()
        history = place.history()
        second_revision_digest = history["revisions"][1]["digest"]
        second_revision = Place.objects.revision(place, second_revision_digest)
        
        self.assertEqual(place.name,  second_revision["place"].name)
                
            

#place tests
class PlaceGetCase(PlaceTestCase):
    
    def test_add_and_save(self):
        place = Place({"relationships": [], "admin": [], "updated": "2012-01-15T01:00:00+01:00",
                "name": "Test Add name", "geometry": {"type": "Point", "coordinates": [-98.46283, 41.89501]}, 
                "is_primary": "true", "uris": ["newsite.org/123"], "feature_code": "BDG", 
                "centroid": [-98.46283, 41.89501], "timeframe": {}})
        place.id = "abcdefg123"
        details = place.save()
        place2 = Place.objects.get("abcdefg123")
        
        self.assertEqual(place2.name, place.name)
        
     
    def test_find_similar(self):
        place = Place.objects.get("d5dd4f6d78614061")
        similar = place.find_similar()
        
        self.assertIsNotNone(similar["places"])
        self.assertGreater(len(similar["places"]), 0)
    
    @unittest.skip("not written yet")    
    def test_rollback(self):
        pass
        
        
    @unittest.skip("not written yet")    
    def test_add_relation(self):
        pass
        
    @unittest.skip("not written yet")    
    def test_upadate_relation(self):
        pass
    
    @unittest.skip("not written yet")
    def test_delete_relation(self):
        pass
    

    @unittest.skip("not written yet")
    def test_revision_rollback(self):
        pass
        #print Place.RELATIONSHIP_CHOICES
        #place1 = Place.objects.get("83031b99361ca551")
        ##place2 = Place.objects.get("03407abf333a71dc")
        ##place3 = Place.objects.get("fbeab34f647b9ae1")
        ##place4 = Place.objects.get("9484c3bd08cf7a8d")

        ##place1.add_relationship(place2.id, "conflates", {"comment":"add 1"})
        
        ##place1 = Place.objects.get("83031b99361ca551")
           
        ##place2 = Place.objects.get("03407abf333a71dc")
        
        ##place1.add_relationship(place3.id, "conflates", {"comment":"add 2"})
        ##place1.add_relationship(place4.id, "conflates", {"comment":"add 3"})
        
        ###place1 should have 3 relationships now
        ###reload
        ##place1 = Place.objects.get("83031b99361ca551")
        
        ##self.assertEqual(len(place1.relationships), 3)
        
        #history = place1.history()
        #print history
        
        ##rollback
        #place1.rollback("e51b6c052f0d3bad9b3dcb26f79ecea08afa4377", {"comment":"rollback to second rev"})
        #place1 = Place.objects.get("83031b99361ca551")
        #print place1.relationships
        #place2 = Place.objects.get("03407abf333a71dc")
        #print place1.relationships
        #place3 = Place.objects.get("fbeab34f647b9ae1")
        #print place1.relationships
        #place4 = Place.objects.get("9484c3bd08cf7a8d")
