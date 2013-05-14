from pyelastichistory import *
from pyelasticsearch.exceptions import ElasticHttpNotFoundError 
from django.conf import settings
import json
import datetime

from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.geos import MultiPolygon
from django.contrib.gis.geos import MultiPoint
from models import FeatureCode, AdminBoundary

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
        return self.conn.count(keyword, index=self.index, doc_type=self.doc_type).count

    #searches - returns a dict of the search hits
    #search query to be in the form: "user:Tester" is user is desired, for example
    #bbox (optional) format [min_x, min_y, max_x, max_y] If bbox is set to False, it will search for places with no geo / centroid
    #setting bbox to None searches for any place with or without geo
    #start_date. String. see end date
    #end_date. String. Get places whose timeframe lies between these two dates. 
    #Either none or both start_date and end_date must be present. Format of a date: "YYYY-MM-DD" - like: "1990-01-01"
    #sort - by match (default) if bbox is given, results are sorted by distance from bbox centroid, then by match.
    #pagination attributes: per_page, from_index, page. 
    #per_page: number of results. (default 100)
    #from_index: the starting index for the results to be given.(default 0)
    #page: if given, takes precedence over from_index. zero based
    #returns a dict with totals, max_score, pagination information, and a places list containing matching Places 
    def search(self, query_term, bbox=None, start_date=None, end_date=None, per_page=100, from_index=0, page=None):
        if page:
            from_index = page * per_page
        
        filter_list = []
        bbox_filter = {}
        
        sort = {}

        if bbox:
            top_left = [bbox[0], bbox[3]]
            bottom_right = [bbox[2], bbox[1]]
            bbox_filter = { 
                        "geo_bounding_box": {
                            "place.centroid": {
                                "top_left": top_left,
                                "bottom_right": bottom_right                              
                         }}
                     }
            
            y_diff = bbox[1] - bbox[3]
            x_diff = bbox[0] - bbox[2]
            centroid_lat = bbox[3] + (y_diff / 2)
            centroid_lon = bbox[2] + (x_diff / 2)
            
            #distance_type = "plane" (quicker, circle) or "arc"  (default, more precise, elliptical)
            sort = { "_geo_distance" : {
                        "place.centroid" : [centroid_lon, centroid_lat],
                        "order" : "asc",
                        "distance_type" : "plane" }
                    }
            filter_list.append(bbox_filter)
        
        if bbox == False:
            geo_missing_filter = { "missing" : { "field" : "centroid" }  }
            filter_list.append(geo_missing_filter)
                    
        #optional date query / filtering
        if start_date and end_date:
            #where either the beginning or the end of the range falls in the search
            date_filter = {
                "or" : [
                    {"numeric_range" : {
                            "timeframe.start" : {
                                "gte" : start_date,
                                "lte" : end_date
                            }
                        }
                    },
                    {"numeric_range" : {
                            "timeframe.end" : {
                                "gte" : start_date,
                                "lte" : end_date
                            }
                        }
                    }
                ]
            }

            #if place is 1900-1920 and search is within the range 1910-1915
            within_date_filter = {
                "and" :[
                    {"numeric_range" : {
                            "timeframe.start" : {
                                "lte" : start_date
                            }
                        }
                    },
                    {"numeric_range" : {
                            "timeframe.end" : {
                                "gte" : end_date
                            }
                        }
                    }
                ]
            }

            final_date_filter = {
                "or": [
                    date_filter,
                    within_date_filter
                ]
            }
           


            filter_list.append(final_date_filter)
                   
        primary_filter = {"term":{ "is_primary": True} }
        
        filter_list.append(primary_filter)
        
        filter = { "and": filter_list }
        
        query = {'size' : per_page, 'from': from_index,
                'sort' : [sort],
                'query': {
                    "filtered": {
                        "query" : {
                             'query_string': {
                                    'default_operator' : 'AND',
                                    'query': query_term
                                    }
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
        
        if results.hits["total"] > per_page:
            page = (from_index / per_page) + 1
        else:
            page = 1
            
        return {"total": results.hits["total"], "max_score": results.hits["max_score"], "per_page": per_page, "from_index": from_index, "page":page, "places": places}  

    #gets the specified place as a Place object
    #Place.objects.get("0908d08a995ab874")
    def get(self, obj_id):
        doc = self.conn.get(self.index, self.doc_type, obj_id)
        items = doc.items()  #a list of tuples
        items.append( ("id",doc.id) ) #add the id to this list, and cast to a dict to make a new place
        return Place(dict(items))

    #returns similar objects
    #distance (optional) string representation of the distance to look for similar places. Defaults to 10km
    #if the place has no centroid defined, it will just do a search for any similar place
    def find_similar(self, place, distance="10km"):
        
        geo_filter = {}
        sort = {}
        if place.centroid:
            centroid = place.centroid
            centroid_lon, centroid_lat = place.centroid[0], place.centroid[1]
            
            #just return those similar places within specified distance of the place
            geo_filter = { 
                "geo_distance" : {
                    "distance" : distance,
                    "place.centroid" : [centroid_lon, centroid_lat]
                }
            }
            
            #sort the places by the closest first, then match
            sort = {
                "_geo_distance" : {
                    "place.centroid" : [centroid_lon, centroid_lat],
                    "order" : "asc",
                    "distance_type" : "plane" }
            }
        
        #more like this query, similar to the name.
        mlt_query = { 
            "more_like_this" : {
                "like_text" : place.name,
                "fields" : ["name"],
                "min_term_freq" : 1,
                "min_doc_freq" : 1,
            }
        }
            
        query = {
            'sort' : [sort],
            'query': {
                "filtered": {
                    "query" : mlt_query,
                    "filter": geo_filter
                }}
        }
        
        results = self.conn.search(query, index=self.index, doc_type=self.doc_type)
        places = []
        if len(results.hits["hits"]) > 1:
            for result in results.hits["hits"]:
                if result.id == place.id:
                    continue
                result.source['id'] = result.id
                places.append(Place(result.source))
        return {"total": results.hits["total"], "max_score": results.hits["max_score"], "places": places}
    
    #gets the history and revisions of a record
    def history(self, place):
        history = {}
        try:
            results = self.conn.history(self.index, self.doc_type, place.id) #history index is self.index+"-history" i.e. gazetteer-history
            history = {"place": place.id, "version": results.version, "revisions": results["revisions"]}
        except ElasticHttpNotFoundError:
            history = {}
            
        return history
        
        
    
    #gets a revision by passing in a specified revision digest, contains a dict with an old Place object in it.
    def revision(self, place, revision_digest):
        rev = self.conn.revision(self.index, self.doc_type, place.id, revision_digest)
        old_place = Place(rev.source)
        return {"place": old_place, "version": rev.version, "digest": rev.id, "place_source" : rev.source}
        
    #compare two place revisions
    def diff(self, digest1, digest2):
        return None
        
    #rollbacks a place to the target revision, with optional metadata
    #returns the reloaded, rollbacked place
    def rollback(self, place, target_revision, metadata={}):
        thing = self.conn.rollback(self.index, self.doc_type, place.id, target_revision, metadata)
        new_place = self.get(place.id)  #reloads the place
        return new_place
   
    #saves a place with metadata about the save
    #metatdata"user_created": "Jane J. Editor"
    def save(self, place, metadata={}):
        if place.id:
            json = place.to_json()
            self.conn.index(self.index, self.doc_type, json, id=place.id, metadata=metadata)
        return None

    # an iterator that returns all objects eventually
    def all(self, query=None, size=100):
        if not query: query = {"query": {"match_all":{}}}
        args = {"index": self.index, "doc_type": self.doc_type, "from": 0, "size": size}
        while True:
            results = self.conn.search(query, **args)
            if not results.hits["hits"]: break
            for result in results.hits["hits"]:
                result.source['id'] = result.id
                yield Place(result.source)
            args["from"] += len(results.hits["hits"])


class Place(object):

    objects = PlaceManager()
    
    __slots__ = ['id', 'name', 'centroid','geometry','is_primary','updated','feature_code', 'uris', 'relationships', 'timeframe', 'alternate', 'population', 'area', 'importance', 'admin', 'is_composite']

    #creates a new Place object using a dictionary of values to populate __slots__ attributes.
    #attributes not in the dictionary are set None
    def __init__(self, attributes_dict=None):
        for slot in self.__slots__:
            if attributes_dict and slot in attributes_dict:
                setattr(self, slot, attributes_dict[slot])
            else:
                setattr(self, slot, None)
                   
    
    def __repr__(self):
        attrs = {}
        for attr in self.__slots__:
            attrs[attr] = getattr(self, attr)
        return "<%s %s>" % (self.__class__, attrs) 

    #saves the new / changed object
    #updated gets set here as utc automatically before saving.
    #skip_checks skips the before_save and after_save methods avoiding any admin assignation and composite place checks.  
    def save(self, metadata={"user": "unknown"}, skip_checks=False):
        do_after = False
        if not skip_checks:
            do_after = self.before_save()
            
        self.updated = datetime.datetime.utcnow().replace(second=0, microsecond=0).isoformat()
        Place.objects.save(self, metadata)
        
        if do_after:
            self.after_save()
        
        return True
    
    #method called before a place.save call
    #checks to see if the geometry has been changed
    #if it has changes, AND if the centroid has been changed- redo the admin check
    #Note it's possible to not change the admin by changing the geometry by keeping the centroid the same
    #returns True if it needs to call do_after (that is, if it's composite place need updating) 
    #returns False otherwise
    def before_save(self):
        do_after = False
        new_object = False
        if not self.id:
            new_object = True
        
        try:
            stored_place = Place.objects.get(self.id)
        except ElasticHttpNotFoundError:
            new_object = True
            
        if new_object or not stored_place.geometry == self.geometry:
            #only update admin assignation if the centroid has been changed 
            if new_object or not stored_place.centroid == self.centroid:
                self.assign_admin()
                
            #see if it's part of any composite places
            for rel in self.relationships:
                if rel["type"] == "comprises":
                    do_after = True

        return do_after
            
    #after save method to do stuff. 
    #Currently only calculates a place's composite place
    def after_save(self):
        for rel in self.relationships:
             if rel["type"] == "comprises":
                composite_place = Place.objects.get(rel["id"])
                composite_place.calc_composite_geometry()
                composite_place.save()
        return True
    
    #returns a reloaded copy of the place
    #TODO create a reload function
    def copy(self):
        return Place.objects.get(self.id)
    
    #updates the attributes of the place based in the passed in dict
    #cannot update the ID nor the relationships list
    def update(self, attributes_dict):
        for slot in self.__slots__:
            if slot == "id" or slot == "relationships":
                continue
                
            if slot in attributes_dict:
                setattr(self, slot, attributes_dict[slot])
        
        
        
    def feature_code_name(self):
        feature_code_name = ''
        try:
            feature_code_name = FeatureCode.objects.get(typ=self.feature_code).name
        except:
            feature_code_name = ''
        
        return feature_code_name
        
    #returns straight json from this object    
    def to_json(self):
        json = {}
        for attr in self.__slots__:
            if hasattr(self, attr):
                json[attr] = getattr(self, attr)
        return json

    #gets geojson document from this place
    def to_geojson(self):
        d = {}
        d['type'] = 'Feature'
        d['geometry'] = self.geometry

        d['properties'] = { 
            'id': self.id,
            'name': self.name,
            'is_primary': self.is_primary,
            'is_composite': self.is_composite,
            'feature_code': self.feature_code,
            'feature_code_name': self.feature_code_name(), #FIXME: is this required? if it does not need to be in GeoJSON feed, implement as templatetag
            'uris': self.uris,
            'alternate': self.alternate,
            'timeframe': self.timeframe,
            'area': self.area,
            'population': self.population,
            'importance': self.importance,
            'admin': self.admin
        }
        return d
        
    #converts a geojson representation to a place
    def from_geojson(self, geojson):
        json_obj = geojson.pop("properties")
        json_obj['geometry'] = geojson
        p = Place(json_obj)
        

    def find_similar(self):
        return Place.objects.find_similar(self)

    def history(self):
        return Place.objects.history(self)
        
    #rollbacks the Place instance and returns the newly rollbacked version
    #will also update any relationships with other places which may have changed
    def rollback(self, target_revision, metadata={}):
        new_place = Place.objects.rollback(self, target_revision, metadata=metadata)
        
        self.update_relations(target_revision, metadata)
        
        self = new_place
        return self
   
    
    def update_relations(self, target_revision, metadata):
        relations_deletes, relations_adds  = self.revision_relations(target_revision)
        self.delete_and_add_relations(relations_deletes, relations_adds, metadata)
        return None
  
    #Finds which relations need changing between the place and a revision.
    #Returns two lists of relations dicts.
    #within, a list where they are in the current place but not in the target revison. (a rollback should delete these)
    #without, a list where they are not in the current place but are in the target revision. (a rollback should add these)
    def revision_relations(self, revision_digest):
        revision = Place.objects.revision(self, revision_digest)["place"]
        within = []
        for srel in self.relationships:
            if not srel in revision.relationships:
                within.append(srel)
        without = []
        for trel in revision.relationships:
            if not trel in self.relationships:
                without.append(trel)
        
        return within, without
    
    # Updates the relationships of this place based on two passed in lists
    # make this private?
    def delete_and_add_relations(self, to_delete, to_add, metadata):
        for delrel in to_delete:
            target_place = Place.objects.get(delrel["id"])

            rel_to_delete = {"id":self.id, "type": self.RELATION_CHOICES[delrel["type"]]}

            if rel_to_delete in target_place.relationships:
                target_place.relationships.remove(rel_to_delete)
                
                if (rel_to_delete["type"] == "conflated_by"):
                    set_primary = True
                    for relation in target_place.relationships:
                        if not relation["id"] == self.id and relation["type"] == "conflated_by":
                            set_primary = False
                    
                    target_place.is_primary = set_primary
                
                target_place.save(metadata)
            
        for addrel in to_add:
            target_place = Place.objects.get(addrel["id"])
            
            rel_to_add = {"id": self.id, "type": self.RELATION_CHOICES[addrel["type"]]}

            if rel_to_add not in target_place.relationships:
                target_place.relationships.append(rel_to_add)
                target_place.save(metadata)
        
        return None
            
    
    #Adds relations between this Place and another target Place (this place --conflates--> target) and will add the reverse relationship (target --conflated_by--> this place)
    #The target relation is like 'conflates' ---> 'conflated_by'
    #The same metadata comment is saved with each new record.
    #If relation is "conflates" then the target place's is_primary attribute is set to False
    #Usage
    #add_relation(target_place, relationship_type, metadata)
    #Example 
    #place.add_relation(other_place, "replaces", {"user":"tim", "comment":"This geonames record replaces this duplicate"} )
    #Returns True if the operation succeed, False if not.
    #reasons why it has not succeeded include * relation already exists * invalid relation type
    #only one relation between two places can exist at a time, adding will overwrite any existing 
    #TODO - Add better error / exceptions?
    RELATION_CHOICES = {
            'conflates'     : 'conflated_by', 
            'contains'      : 'contained_by',
            'replaces'      : 'replaced_by',
            'supplants'     : 'supplanted_by',
            'comprises'     : 'comprised_by',
            'conflated_by'  : 'conflates',
            'contained_by'  : 'contains',
            'replaced_by'   : 'replaces',
            'supplanted_by' : 'supplants',
            'comprised_by'  : 'comprises'
    }
    
    def add_relation(self, target_place, relation_type, metadata):
        #are they tryng to add the same place?
        if target_place.id == self.id :
            return False
        #is the type allowed? 
        if relation_type not in self.RELATION_CHOICES.keys():
            return False
            
        #TODO - this is a validation if a place has nothing set for relationships
        #A place should never has this set as None
        #consider moving to the validation, or to object initialisation code
        if target_place.relationships == None:
            target_place.relationships = []
        if self.relationships == None:
            self.relationships = []
            
        #does it already exist?
        if {"id":target_place.id, "type":relation_type} in self.relationships:
            return False
            
        target_type = self.RELATION_CHOICES[relation_type]

        self.remove_relation(target_place) #remove any existing but dont save, yet

        source_relation =  {"id":target_place.id, "type": relation_type}
        self.relationships.append(source_relation)
                    
        target_relation = {"id":self.id, "type": target_type}
        target_place.relationships.append(target_relation)
        
        if relation_type == "conflates":
            target_place.is_primary = False
        
        #if this is a composite place and a new component has been added, union the geometry
        if relation_type == "comprised_by" and self.is_composite:
            self.calc_composite_geometry()
        
        self.save(metadata)
        target_place.save(metadata)
        return True
        
    #removes any relations from this place object and another.
    #does not save either place, however
    def remove_relation(self, target_place):
        calc_self_geom = False
        for srel in self.relationships:
            if target_place.id in srel.values():
                self.relationships.remove(srel)
                if srel["type"] == "comprised_by" and self.is_composite:
                    calc_self_geom = True
                    
                
        for trel in target_place.relationships:
            if self.id in trel.values():
                target_place.relationships.remove(trel)
    
        if calc_self_geom:
            self.calc_composite_geometry()
        return True
        
    #just deletes a relation between this place and target place
    #saves both places
    def delete_relation(self, target_place, metadata):
        self.remove_relation(target_place)
        
        self.save(metadata)
        target_place.save(metadata)
        return True
        
    def add_admin(self, new_boundary):
        for existing_boundary in self.admin:
            if existing_boundary.get("id") and existing_boundary["id"] == new_boundary["id"]:
                self.admin.remove(existing_boundary)
 
        self.admin.append(new_boundary)
        return True
    
    #searches through admin boundaries and populates the admin
    #property of the place
    #will delete existing admin entries if the "id" property is populated
    #will not assign admin to composite places or those with a historical timeframe
    def assign_admin(self):
        if self.is_composite or self.timeframe or not self.centroid:
            return False
        
        centroid_geom = str({"type":"Point", "coordinates": self.centroid})
        place_geom = GEOSGeometry(centroid_geom)

        temp_admin  = list(self.admin)
        for existing_admin in self.admin:
            if existing_admin.get("id"):
                temp_admin.remove(existing_admin)
                
        self.admin = list(temp_admin)

        results = AdminBoundary.objects.filter(queryable_geom__contains=place_geom)
        if results:
            for boundary in results:
                self.add_admin(boundary.to_place_json())
                
        return self.admin
        
    #unions a places geometry with another geometry
    def union_geometry(self, target_geometry):
        #the target could have no geometry
        if not target_geometry:
            return True
        
        #composite place could have no geometry (especially at the beginning)    
        if not self.geometry:
            self.geometry = target_geometry
            return True
            
        place_geom = GEOSGeometry(json.dumps(self.geometry))
        target_geom = GEOSGeometry(json.dumps(target_geometry))
        union = place_geom.union(target_geom)
        self.geometry  = json.loads(union.json)
        return True
    
    #method for composite places.
    #Goes through the component places does a union on them and assigns the geometry to the result
    #Works with polygons and multipolygons or points and multipoints.
    def calc_composite_geometry(self):
        geometries = []
        
        for relation in self.relationships:
            if relation["type"] == "comprised_by":
                relation_geometry = Place.objects.get(relation["id"]).geometry
                if relation_geometry:
                    geos_geom = GEOSGeometry(json.dumps(relation_geometry))
                    if geos_geom.geom_type == "MultiPolygon" or geos_geom.geom_type == "MutliPoint":
                        for indiv_geom in geos_geom:
                            geometries.append(indiv_geom)
                    elif geos_geom.geom_type == "Polygon" or geos_geom.geom_type == "Point":
                        geometries.append(geos_geom)
                    else:
                        pass
                        
        if not geometries:
            return False
            
        if geometries[0].geom_type == "Polygon":
            union = MultiPolygon(geometries).cascaded_union
        elif geometries[0].geom_type == "Point":
            union = MultiPoint(geometries)
            
        self.geometry = json.loads(union.json)
        self.centroid = union.centroid.coords
        
        return True
        
