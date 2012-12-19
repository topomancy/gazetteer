from pyelastichistory import *
from pyelasticsearch.exceptions import ElasticHttpNotFoundError 
from django.conf import settings
import json
import datetime
from models import FeatureCode

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
        return self.conn.count(keyword).count

    #searches - returns a dict of the search hits
    #search query to be in the form: "user:Tester" is user is desired, for example
    #bbox (optional) format [min_x, min_y, max_x, max_y] 
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
        
        filter = {}
        sort = {}

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
           

            #'AND' these date filters together, and if there's a geo / bbox filter, 'and' that too.
            #fixme - must be a nicer way to do the following?
            if filter:
                filter = {
                    "and" : [
                       final_date_filter,
                       filter
                    ]
                }
            else:
                filter = final_date_filter
                   

       
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
    def find_similar(self, place, distance="10km"):
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
        if len(results.hits["hits"]) > 0:
            for result in results.hits["hits"]:
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
    

    #returns the heirarchy of this object
    def heirarchy(self, place):
        return None

    
    #saves a place with metadata about the save
    #metatdata"user_created": "Jane J. Editor"
    def save(self, place, metadata={"user_created": ""}):
        if place.id:
            json = place.to_json()
            self.conn.index(self.index, self.doc_type, json, place.id, metadata=metadata)
        return None



class Place(object):

    objects = PlaceManager()
    
    __slots__ = ['id', 'name', 'centroid','geometry','is_primary','updated','feature_code', 'uris', 'relationships', 'timeframe', 'alternate', 'population', 'area', 'importance']

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
    def save(self, metadata={"user_created": ""}):
        self.updated = datetime.datetime.utcnow().replace(second=0, microsecond=0).isoformat()
        Place.objects.save(self, metadata)
        
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
            'feature_code': self.feature_code,
            'feature_code_name': self.feature_code_name(), #FIXME: is this required? if it does not need to be in GeoJSON feed, implement as templatetag
            'uris': self.uris,
            'alternate': self.alternate,
            'timeframe': self.timeframe,
            'area': self.area,
            'population': self.population,
            'importance': self.importance,
            'relationships': self.relationships
        }
        return d
        
    #converts a geojson representation to a place
    def from_geojson(self, geojson):
        json_obj = geojson.pop("properties")
        json_obj['geometry'] = geojson
        p = Place(json_obj)
        

    def find_similar(self):
        return Place.objects.find_similar(self)

    #rollbacks the Place instance and returns the newly rollbacked version
    #FIXME - this should change the original object I think?
    def rollback(self, target_revision, metadata={}):
        new_place = Place.objects.rollback(self, target_revision, metadata=metadata)
        self = new_place
        return self
