from django.utils import unittest
import json
from django.contrib.gis.geos import GEOSGeometry
from gazetteer.place import *
from gazetteer.models import AdminBoundary

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
        #see data/test_places.fixture.geojson  
        self.place_1 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "Vonasek Dam North West", "geometry": {"type": "Point", "coordinates": [-114.43359375, 44.033203125]}, "is_primary": true, "uris": ["geonames.org/5081200"], "feature_code": "DAM", "centroid": [-114.43359375, 44.033203125], "timeframe": {"end_range": 0,"start": "1800-01-01","end": "1900-01-01","start_range": 0 }}')
        place_id1 = "1111"
        place1 =  self.conn.index("gaz-test-index", "place", self.place_1, id=place_id1, metadata={"user_created": "test program"})
        
        self.place_2 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "Vorhees City South West", "geometry": {"type": "Point", "coordinates": [-114.78515625, 35.595703125]}, "is_primary": true, "uris": ["geonames.org/5081202"], "feature_code": "PPL", "centroid": [-114.78515625, 35.595703125], "timeframe": {"end_range": 0,"start": "1901-01-01","end": "1999-01-01","start_range": 0}}')
        place_id2 = "2222"
        place2 =  self.conn.index("gaz-test-index", "place", self.place_2, id=place_id2, metadata={"user_created": "test program"})
        
        self.place_3 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "Wabash Post Office (historical) North East", "geometry": {"type": "Point", "coordinates": [-93.8671875, 42.978515625]}, "is_primary": true, "uris": ["geonames.org/5081219"], "feature_code": "PO", "centroid": [-93.8671875, 42.978515625], "timeframe": {"end_range": 0,"start": "1901-01-01","end": "1999-01-01","start_range": 0}}')
        place_id3 = "3333"
        place3 =  self.conn.index("gaz-test-index", "place", self.place_3, id=place_id3, metadata={"user_created": "test program"})
          
        self.place_4 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "Wabash Municipal Park South East", "geometry": {"type": "Point", "coordinates": [-88.06640625, 33.486328125]}, "is_primary": true, "uris": ["geonames.org/5081227"], "feature_code": "PRK", "centroid": [-88.06640625, 33.486328125], "timeframe": {"end_range": 0,"start": "1800-01-01","end": "1900-01-01","start_range": 0}}')
        place_id4 = "4444"
        place4 =  self.conn.index("gaz-test-index", "place", self.place_4, id=place_id4, metadata={"user_created": "test program"})
        
        self.place_5 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "Wabash Municipal Park somewhere", "geometry": {"type": "Point", "coordinates": [-88.06640611, 33.486328111]}, "is_primary": true, "uris": ["geonames.org/5081227"], "feature_code": "PRK", "centroid": [-88.06640611, 33.486328111], "timeframe": {"end_range": 0,"start": "1800-01-01","end": "1900-01-01","start_range": 0}}')
        place_id5 = "5555"
        place5=  self.conn.index("gaz-test-index", "place", self.place_5, id=place_id5, metadata={"user_created": "test program"})
        
        self.place_6 = json.loads('{"relationships": [], "admin": [], "updated": "2006-01-15T01:00:00+01:00", "name": "East no coordinates", "geometry": {}, "is_primary": true, "uris": ["geonames.org/5081227"], "feature_code": "PRK", "centroid": [], "timeframe": {"end_range": 0,"start": "1800-01-01","end": "1900-01-01","start_range": 0} }')
        place_id6 = "6666"
        place6=  self.conn.index("gaz-test-index", "place", self.place_6, id=place_id6, metadata={"user_created": "test program6"})
        
        self.conn.refresh(["gaz-test-index"]) 
        

    def tearDown(self):
        try:
            self.conn.delete_index("gaz-test-index")
            self.conn.delete_index("gaz-test-index-history")
        except:
            pass
            
            
    def assertListContainsName(self, placelist, expected_name):
        for p in placelist:
            if p.name == expected_name:
                return True
        raise AssertionError("%r was not in list %r" %(expected_name, placelist))
    
    def assertListNotContainsName(self, placelist, expected_name):
        for p in placelist:
            if p.name == expected_name:
                raise AssertionError("%r was in list %r" %(expected_name, placelist))
        return True

#PlaceManger (count, search, revision)
#some methods are wrapped covered by place test,
class ManagerTestCase(PlaceTestCase):
    
    def test_get(self):        
        place = Place.objects.get("1111")
        self.assertEqual(place.name, self.place_1["name"])

    
    def test_count(self):
        count = Place.objects.count("*")
        self.assertEqual(count, 6)
        
    #query_term, bbox=None, start_date=None, end_date=None, per_page=100, from_index=0, page=None):
    def test_search(self):
        results = Place.objects.search("East")
        self.assertEqual(len(results["places"]), 3)
        self.assertListContainsName(results["places"], self.place_3["name"])
        self.assertListContainsName(results["places"], self.place_4["name"])
        self.assertListContainsName(results["places"], self.place_6["name"])
        
        results = Place.objects.search("Wabash")
        self.assertListNotContainsName(results["places"], self.place_6["name"])
                
        bbox = [-138.339843, 5.5285105, -53.964843, 61.354613]
        results = Place.objects.search("*", bbox)
        self.assertEqual(len(results["places"]), 5)
        
        bbox = [-119.4873046, 8.7547947, -77.299804, 41.079351]
        results = Place.objects.search("*", bbox)
        self.assertEqual(len(results["places"]), 3)
        
        bbox = [-119.4873046, 8.7547947, -77.299804, 41.079351]
        results = Place.objects.search("East", bbox)
        self.assertEqual(len(results["places"]), 1)
        self.assertListContainsName(results["places"], self.place_4["name"])
        
        results = Place.objects.search("*", bbox, start_date="1902-01-01", end_date="1990-01-01")
        self.assertEqual(len(results["places"]), 1)
        self.assertListContainsName(results["places"], self.place_2["name"])
        
    def test_no_geo_search(self):
        results = Place.objects.search("*", bbox=False)
        self.assertEqual(len(results["places"]), 1)
        self.assertListContainsName(results["places"], self.place_6["name"])
        
        results = Place.objects.search("East", bbox=False)
        self.assertEqual(len(results["places"]), 1)
        self.assertListContainsName(results["places"], self.place_6["name"])
        
        results = Place.objects.search("East", bbox=False, start_date="1850-01-01", end_date="1890-01-01")
        self.assertEqual(len(results["places"]), 1)
        self.assertListContainsName(results["places"], self.place_6["name"])

    def test_is_primary_search(self):
        results = Place.objects.search("East")
        self.assertEqual(len(results["places"]), 3)
        
        self.assertListContainsName(results["places"], self.place_3["name"])
        self.assertListContainsName(results["places"], self.place_4["name"])

        
        third = Place.objects.get("3333")
        third.is_primary = False
        third.save()
        self.conn.refresh(["gaz-test-index"]) 
        
        #third should not show up now
        results = Place.objects.search("East")
        
        self.assertEqual(len(results["places"]), 2)
        self.assertListContainsName(results["places"], self.place_4["name"])
        self.assertListContainsName(results["places"], self.place_6["name"])
        self.assertListNotContainsName(results["places"], self.place_3["name"])
        
        
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
        
     
    def test_no_find_similar(self):
        place = Place.objects.get("1111")
        similar = place.find_similar()
        self.assertIsNotNone(similar["places"])
        self.assertEqual(len(similar["places"]), 0)

    def test_find_similar(self):
        place = Place.objects.get("5555")
        similar = place.find_similar()
        self.assertIsNotNone(similar["places"])
        self.assertGreater(len(similar["places"]), 0)
        self.assertEqual(similar["places"][0].id, "4444")
    
    def test_find_similar_for_non_geo(self):
        place = Place.objects.get("6666")
        similar = place.find_similar()
        self.assertIsNotNone(similar["places"])
        self.assertListContainsName(similar["places"], self.place_3["name"])
        self.assertListContainsName(similar["places"], self.place_4["name"])
    
    
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

        first.add_relation(second, "conflates", {"comment":"1 conflates 2"})
        first.add_relation(third, "conflates", {"comment":"1 conflates 3"})
        first.add_relation(fourth, "conflates", {"comment":"1 conflates 4"})
        
        second.add_relation(fourth, "conflates", {"comment":"2 conflates 4"})
        
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
         

#python manage.py test --settings=gazetteer.test_settings gazetteer.AdminBoundaryModelTestCase
class AdminBoundaryModelTestCase(PlaceTestCase):
    def setUp(self):
        super(AdminBoundaryModelTestCase, self).setUp()
        json_data = open('data/test_states.fixture.geojson')
        self.states = json.load(json_data)["features"]
        
        for state in self.states:
            place = {
                "relationships": [],"admin": [], 
                "updated": "2013-01-15T01:00:00+01:00", "name": "", 
                "geometry": {}, "is_primary": True,
                "uris": [], "feature_code": "ADM1",
                "centroid": [], "timeframe": {} 
                }
            place["name"] = state["properties"].get("name")
            place["geometry"] = state["geometry"]
            place["centroid"] = state["properties"]["centroid"]
            place["uris"] = ["http://fixture.state.com/"+state["properties"]["id"] ]
            # import into ES
            new_place = self.conn.index("gaz-test-index", "place", place, id=state["properties"]["id"], metadata={"user_created": "test program"})
            
            # create AdminBoundary
            geometry = GEOSGeometry(json.dumps(state["geometry"]))
            new_admin = AdminBoundary(uuid=state["properties"]["id"], name=place["name"], feature_code=place["feature_code"], geom=geometry, queryable_geom=geometry, uri=place["uris"][0], alternate_names=state["properties"]["alternate_names"])
            new_admin.save()
    
    def tearDown(self):
        super(AdminBoundaryModelTestCase, self).tearDown()
        AdminBoundary.objects.all().delete()
        
      
    def test_point_in_polygon(self):
        centroid_json = json.dumps(self.place_1["geometry"])        
        place_geometry = GEOSGeometry(centroid_json)
        
        results = AdminBoundary.objects.filter(queryable_geom__contains=place_geometry)
        self.assertEquals(len(results), 1)
        self.assertEquals(results[0].name, "west")
        
     
    def test_add_admin_boundary(self):
        place = Place.objects.get("1111")
        self.assertEqual(place.admin, [])
        
        place.add_admin({"id" : "newstate1", "name" : "new state", 
            "feature_code" : "ADM1" , "alternate_names": []})
        self.assertEqual(len(place.admin), 1)
        self.assertEqual(place.admin[0]["name"], "new state")
        
        place.add_admin({"id" : "newstate1", "name" : "new state renamed",
            "feature_code" : "ADM1" , "alternate_names": []})
        
        self.assertEqual(len(place.admin), 1)
        self.assertEqual(place.admin[0]["name"], "new state renamed")
        
    def test_assign_admin_boundary(self):
        place = Place.objects.get("1111")
        place.timeframe = {}  # NOTE: places will only get assigned if they dont have a timeframe.
        
        self.assertEqual(place.admin, [])   #no admin at the beginning
        
        #Assign admin
        place.assign_admin()
        self.assertEqual(place.admin[0]["name"], "west") 
        
        #Change geometry/centroid
        place.centroid = [-99.34, 41.69]
        place.assign_admin()
        self.assertEqual(len(place.admin), 1)
        self.assertEqual(place.admin[0]["name"], "north_east")
        
        #Add not in index admin with an id - it should delete it
        place.admin.append({"id": "ss", "name":"admin not in index", "feature_code":"EX" })
        ascas = place.assign_admin()
        self.assertEqual(len(place.admin), 1)
        self.assertEqual(place.admin[0]["name"], "north_east")
        
        #Add not in index admin without an id - should keep it
        place.admin.append({"id": "", "name":"admin not in index", "feature_code":"EX" })
        ascas = place.assign_admin()
        self.assertEqual(len(place.admin), 2)
        self.assertEqual(place.admin[0]["name"], "admin not in index")
        self.assertEqual(place.admin[1]["name"], "north_east")
        
        #Change it back to the west
        place.centroid = [-114.43359375, 44.033203125]
        place.assign_admin()
        self.assertEqual(len(place.admin), 2)
        self.assertEqual(place.admin[1]["name"], "west")
    
    #if the geometry changes it will automatically do admin assign
    def test_auto_assign(self):
        place = Place.objects.get("1111")
        place.timeframe = {}  # NOTE: places will only get assigned if they dont have a timeframe.   
        place.save()
        place = place.copy()
        self.assertEqual(place.admin, [])   #no admin at the beginning     
        place.centroid  =  [-99.34, 41.69]
        place.geometry = {"type": "Point", "coordinates": [-99.34, 41.69]}
        place.save()
        place = place.copy()
        self.assertEqual(len(place.admin), 1)
        self.assertEqual(place.admin[0]["name"], "north_east")
        
        
#python manage.py test --settings=gazetteer.test_settings gazetteer.CompositePlaceTestCase
class CompositePlaceTestCase(PlaceTestCase):
    def setUp(self):
        super(CompositePlaceTestCase, self).setUp()
        
        json_data = open('data/test_states.fixture.geojson')
        self.states = json.load(json_data)["features"]
        #state1, state2, state3
        for state in self.states:
            place = {
                "relationships": [],"admin": [], 
                "updated": "2013-01-15T01:00:00+01:00", "name": "", 
                "geometry": {}, "is_primary": True,
                "uris": [], "feature_code": "ADM1",
                "centroid": [], "timeframe": {} 
                }
            place["name"] = state["properties"].get("name")
            place["geometry"] = state["geometry"]
            place["centroid"] = state["properties"]["centroid"]
            place["uris"] = ["http://fixture.state.com/"+state["properties"]["id"] ]
            # import into ES
            new_place = self.conn.index("gaz-test-index", "place", place, id=state["properties"]["id"], metadata={"user_created": "test program"})
        

        self.comp_place_1 = json.loads('{"relationships": [], "admin": [],  "updated": "2006-01-15T01:00:00+01:00", "name": "East States composite place", "is_primary": true, "uris": ["example.com/comp_1"], "feature_code": "COMPOSITE", "is_composite": true}')
        self.comp_place_id_1 = "comp_1"
        self.conn.index("gaz-test-index", "place", self.comp_place_1, id=self.comp_place_id_1, 
                            metadata={"user_created": "test", "comment": "add composite place"})
        
    def test_is_composite(self):
        place = Place.objects.get(self.comp_place_id_1)
        self.assertTrue(place.is_composite)
    
    #Adding a composite relation will automatically generate the geometry of the composite place
    def test_add_comprises_relations(self):
        comp_place1 = Place.objects.get(self.comp_place_id_1)
        state1 = Place.objects.get("state1") #west (our composite place will not be comprised with this one)
        state2 = Place.objects.get("state2") #south_east
        state3 = Place.objects.get("state3") #north_east
        
        comp_place1.add_relation(state2, "comprised_by", {"comment":"comp place comprised by state2"})
        state_copy = state2.copy()
        comp_copy = comp_place1.copy()
        
        self.assertEqual(GEOSGeometry(json.dumps(comp_copy.geometry)).area,
                GEOSGeometry(json.dumps(state_copy.geometry)).area)  #should be the same
        self.assertTrue({'type': 'comprises', 'id': self.comp_place_id_1} in state_copy.relationships) 
        
        comp_copy.add_relation(state3, "comprised_by", {"comment":"comp place comprised by state3"})
        #test to add a blank geom place to a composite place
    
        #test to see if the new area has the area equal to the component
        composite_area = GEOSGeometry(json.dumps(comp_copy.geometry)).area
        state2_area = GEOSGeometry(json.dumps(state2.geometry)).area
        state3_area = GEOSGeometry(json.dumps(state3.geometry)).area
        self.assertAlmostEqual(composite_area, (state2_area + state3_area), places=1)
        
        #add a place with no geo as a component
        no_geo_place = {
                "relationships": [],"admin": [], 
                "updated": "2013-01-15T01:00:00+01:00", "name": "no geo", 
                "geometry": {}, "is_primary": True,
                "uris": ["http://example.com/123"], "feature_code": "ADM1",
                "centroid": [], "timeframe": {} 
                }
        self.conn.index("gaz-test-index", "place", no_geo_place, id="nogeo123", metadata={"user_created": "test program"})
        no_geo_place = Place.objects.get("nogeo123")
        comp_copy.add_relation(no_geo_place, "comprised_by", {"comment":"comp place comprised by no geo place"})
        
        no_geo = no_geo_place.copy()
        self.assertTrue({'type': 'comprises', 'id': self.comp_place_id_1} in no_geo.relationships) 
    
    
    #if a component changes it's geometry it should change the composite place automatically
    def test_change_component(self):
        state1 = Place.objects.get("state1") #west (our composite place will not be comprised with this one)
        state2 = Place.objects.get("state2") #south_east
        state3 = Place.objects.get("state3") #north_east
        comp_place1 = Place.objects.get(self.comp_place_id_1)
        comp_place1.add_relation(state2, "comprised_by", {"comment":"comp place comprised by state2"})
        comp_place1.add_relation(state3, "comprised_by", {"comment":"comp place comprised by state3"})
        comp_copy = comp_place1.copy()
        composite_area = GEOSGeometry(json.dumps(comp_copy.geometry)).area
        state3_area = GEOSGeometry(json.dumps(state3.geometry)).area
        
        state3.geometry = {"type":"Polygon", "coordinates":[[[-103.0892050625, 45.75121434375], [-94.3880331875, 46.01488621875], [-94.3880331875, 37.92894871875], [-103.0892050625, 37.92894871875], [-103.0892050625, 45.75121434375]]]}
        state3.save()
        state3_smaller_area = GEOSGeometry(json.dumps(state3.geometry)).area
        self.assertLess(state3_smaller_area, state3_area)
        comp_copy2 = comp_place1.copy()

        composite_smaller_area = GEOSGeometry(json.dumps(comp_copy2.geometry)).area
        self.assertLess(composite_smaller_area, composite_area)
        
                
    #if the component has its relation removed, it should change the composite place automatically
    def test_remove_relation(self):
        state1 = Place.objects.get("state1") #west (our composite place will not be comprised with this one)
        state2 = Place.objects.get("state2") #south_east
        state3 = Place.objects.get("state3") #north_east
        comp_place1 = Place.objects.get(self.comp_place_id_1)
        comp_place1.add_relation(state2, "comprised_by", {"comment":"comp place comprised by state2"})
        comp_place1.add_relation(state3, "comprised_by", {"comment":"comp place comprised by state3"})
        comp_copy = comp_place1.copy()
        initial_area = GEOSGeometry(json.dumps(comp_copy.geometry)).area
        
        comp_place1.delete_relation(state3, {"comment": "removing relation"})
        comp_copy2 = comp_place1.copy()
                
        smaller_area = GEOSGeometry(json.dumps(comp_copy2.geometry)).area
        self.assertLess(smaller_area, initial_area)
        
        
             

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
        
