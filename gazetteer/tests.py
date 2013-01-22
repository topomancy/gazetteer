from django.utils import unittest
import json
from gazetteer.place import *

#1. edit test_settings.py if appropriate
#2. Run using " python manage.py test --settings=gazetteer.test_settings gazetteer "
#To run a specific testcase: python manage.py test --settings=gazetteer.test_settings gazetteer.ApiTestCase  

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
        self.place_1 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "North West Vonasek Dam", "geometry": {"type": "Point", "coordinates": [-114.43359375, 44.033203125]}, "is_primary": true, "uris": ["geonames.org/5081200"], "feature_code": "DAM", "centroid": [-114.43359375, 44.033203125], "timeframe": {"end_range": 0,"start": "1800-01-01","end": "1900-01-01","start_range": 0 }}')
        place_id1 = "1111"
        place1 =  self.conn.index("gaz-test-index", "place", self.place_1, id=place_id1, metadata={"user_created": "test program"})
        
        self.place_2 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "South West Vorhees City", "geometry": {"type": "Point", "coordinates": [-114.78515625, 35.595703125]}, "is_primary": true, "uris": ["geonames.org/5081202"], "feature_code": "PPL", "centroid": [-114.78515625, 35.595703125], "timeframe": {"end_range": 0,"start": "1901-01-01","end": "1999-01-01","start_range": 0}}')
        place_id2 = "2222"
        place2 =  self.conn.index("gaz-test-index", "place", self.place_2, id=place_id2, metadata={"user_created": "test program"})
        
        self.place_3 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "North East Wabash Post Office (historical)", "geometry": {"type": "Point", "coordinates": [-93.8671875, 42.978515625]}, "is_primary": true, "uris": ["geonames.org/5081219"], "feature_code": "PO", "centroid": [-93.8671875, 42.978515625], "timeframe": {"end_range": 0,"start": "1901-01-01","end": "1999-01-01","start_range": 0}}')
        place_id3 = "3333"
        place3 =  self.conn.index("gaz-test-index", "place", self.place_3, id=place_id3, metadata={"user_created": "test program"})
          
        self.place_4 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "South East Wabash Municipal Park", "geometry": {"type": "Point", "coordinates": [-88.06640625, 33.486328125]}, "is_primary": true, "uris": ["geonames.org/5081227"], "feature_code": "PRK", "centroid": [-88.06640625, 33.486328125], "timeframe": {"end_range": 0,"start": "1800-01-01","end": "1900-01-01","start_range": 0}}')
        place_id4 = "4444"
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
class MangagerTestCase(PlaceTestCase):
    
    def test_get(self):        
        place = Place.objects.get("1111")
        self.assertEqual(place.name, self.place_1["name"])

    
    @unittest.skip("simple")
    def test_count(self):
        count = Place.objects.count("*")
        self.assertEqual(count, 4)
        
    #query_term, bbox=None, start_date=None, end_date=None, per_page=100, from_index=0, page=None):
    def test_search(self):
        results = Place.objects.search("East")
        self.assertEqual(len(results["places"]), 2)
        self.assertEqual(results["places"][0].name, self.place_3["name"])
        self.assertEqual(results["places"][1].name, self.place_4["name"])
        
        bbox = [-138.339843, 5.5285105, -53.964843, 61.354613]
        results = Place.objects.search("*", bbox)
        self.assertEqual(len(results["places"]), 4)
        
        bbox = [-119.4873046, 8.7547947, -77.299804, 41.079351]
        results = Place.objects.search("*", bbox)
        self.assertEqual(len(results["places"]), 2)
        
        bbox = [-119.4873046, 8.7547947, -77.299804, 41.079351]
        results = Place.objects.search("East", bbox)
        self.assertEqual(len(results["places"]), 1)
        self.assertEqual(results["places"][0].name, self.place_4["name"])
        
        results = Place.objects.search("*", bbox, start_date="1902-01-01", end_date="1990-01-01")
        self.assertEqual(len(results["places"]), 1)
        self.assertEqual(results["places"][0].name, self.place_2["name"])

    def test_is_primary_search(self):
        results = Place.objects.search("East")
        self.assertEqual(len(results["places"]), 2)
        self.assertEqual(results["places"][0].name, self.place_3["name"])
        self.assertEqual(results["places"][1].name, self.place_4["name"])
        
        third = Place.objects.get("3333")
        third.is_primary = False
        third.save()
        self.conn.refresh(["gaz-test-index"]) 
        
        #third should not show up now
        results = Place.objects.search("East")
        
        self.assertEqual(len(results["places"]), 1)
        self.assertEqual(results["places"][0].name, self.place_4["name"])
        
        
    def test_get_revision(self):
        place = Place.objects.get("1111")
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
#python manage.py test --settings=gazetteer.test_settings gazetteer.ModelTestCase
class ModelTestCase(PlaceTestCase):
    
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
        place = Place.objects.get("4444")
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
    

    def test_rollback_with_relations(self):
        first = Place.objects.get("1111")
        second = Place.objects.get("2222")
        third = Place.objects.get("3333")
        fourth = Place.objects.get("4444")
        self.assertEqual(len(third.relationships), 0)
        self.assertTrue(third.is_primary)

        first.add_relationship(second, "conflates", {"comment":"1 conflates 2"})
        first.add_relationship(third, "conflates", {"comment":"1 conflates 3"})
        first.add_relationship(fourth, "conflates", {"comment":"1 conflates 4"})
        
        second.add_relationship(fourth, "conflates", {"comment":"2 conflates 4"})
        
        #first should have 3 relationships now
        first = first.copy()
        self.assertTrue(first.is_primary)
        self.assertEqual(len(first.relationships), 3)
        
        second = second.copy()
        self.assertFalse(second.is_primary)
        self.assertEqual(len(second.relationships), 2)
        self.assertTrue({'type': 'conflates', 'id': '4444'} in second.relationships) 
        
        third = third.copy()
        self.assertEqual(len(third.relationships), 1)
        self.assertFalse(third.is_primary)
        
        fourth = fourth.copy()
        self.assertEqual(len(fourth.relationships), 2)
        self.assertFalse(fourth.is_primary)
        
        history = first.history()
        revisions = history["revisions"]
        first_revision_2 = revisions[1]
        self.assertEqual(first_revision_2["comment"], "1 conflates 2")
        
        #ROLLBACK!
        first.rollback(first_revision_2["digest"], {"comment":"rollback to 2nd rev"})
        first = first.copy()
        self.assertEqual(len(first.relationships), 1)
        self.assertTrue(first.is_primary)
        
        second = second.copy()
        self.assertEqual(len(second.relationships), 2)
        self.assertFalse(second.is_primary)
        self.assertTrue({'type': 'conflates', 'id': '4444'} in second.relationships) 
        
        third = third.copy()
        self.assertEqual(len(third.relationships), 0)
        self.assertTrue(third.is_primary)
        
        fourth = fourth.copy()
        self.assertTrue({'type': 'conflated_by', 'id': '2222'} in fourth.relationships) 
        self.assertFalse(fourth.is_primary)
        
        #ROLLFORWARD!
        first = first.copy()
        history = first.history()
        revisions = history["revisions"]
        first_revision_4 = revisions[3]
        self.assertEqual(first_revision_4["comment"], "1 conflates 4")
        first.rollback(first_revision_4["digest"], {"comment":"rollback to 4th rev"})
        
        first = first.copy()
        self.assertEqual(len(first.relationships), 3)
        second = second.copy()
        
        self.assertFalse(second.is_primary)
        
        self.assertTrue({'type': 'conflated_by', 'id': '1111'} in second.relationships)
        third = third.copy()
        
        self.assertTrue({'type': 'conflated_by', 'id': '1111'} in third.relationships)
        fourth = fourth.copy()
        
        self.assertTrue({'type': 'conflated_by', 'id': '1111'} in fourth.relationships) 
        self.assertTrue({'type': 'conflated_by', 'id': '2222'} in fourth.relationships)
         


# To just run the API tests:
# python manage.py test --settings=gazetteer.test_settings gazetteer.ApiTestCase  
from django.test.client import Client
class ApiTestCase(PlaceTestCase):
    
    #TODO encapsulte client to handle auth and decoding json
    #e.g. http://git.io/qtJM9A  (or more, http://pypi.python.org/pypi/django-webtest)
    def test_get(self):
        c = Client()
        resp = c.get('/1.0/place/search.json?q=Wabash%20Municipal')
        self.assertEquals(resp.status_code, 200)
        results =  json.loads(resp.content)
    
        self.assertIsNotNone(results["features"])
        self.assertEqual(results["features"][0]["properties"]["name"], self.place_4["name"] )
        self.assertEqual(results["page"], 1)
        
