# pass in shapefile 
#open shapefile
import sys, json, os

from shapely.geometry import asShape, mapping
from fiona import collection

from core import Dump
from digitizer_types import use_types_map, use_sub_types_map


def extract_shapefile(shapefile, uri_name, simplify_tolerance=None):
    
    for feature in collection(shapefile, "r"):
        
        geometry = feature["geometry"]
        properties = feature["properties"]
        
        #calculate centroid
        geom_obj = asShape(geometry)
        try:
            centroid = [geom_obj.centroid.x , geom_obj.centroid.y]    
        except AttributeError:
            print "Error: ", feature
            continue
        #optionally simplify geometry
        if simplify_tolerance:
            geometry = json.dumps(mapping(geom_obj.simplify(simplify_tolerance)))
        
        #Set name.
        #If a building has no name, give it Number and Street Address.
        number = properties["number"]
        street = ""
        if number:
            street = " "
        street = street + properties["street"]
        name = number + street 
            
        if properties["name"]:
            name = properties["name"]
                    
        #feature code mapping
        feature_code = "BLDG" #default code (building)
        
        if properties["use_type"]:
            feature_code = use_types_map[properties["use_type"]]
        if properties["use_subt82"]:
            try:
                feature_code = use_sub_types_map[properties["use_subt82"]]
            except KeyError:
                pass
        
        source = properties  #keep all fields anyhow
        
        # unique URI which internally gets converted to the place id. 
        # WFS getFeature link / Warper Layer link? both?
        uri = uri_name + "." + feature["id"]
        
        timeframe = {"start_date": properties["layer_year"], "end_date": properties["layer_year"]}
        
        place = {
            "name":name,
            "centroid":centroid,
            "feature_code": feature_code,
            "geometry":geometry,
            "is_primary": True,
            "source": source,
            "uris":[uri],
            "relationships": [],
            "timeframe":timeframe,
            "admin":[]
            
        }
        dump.write(uri, place)
        

if __name__ == "__main__":
    shapefile, uri_name, dump_path = sys.argv[1:4]
    
    #simplify_tolerance = .01 # ~ 11km (.001 = 111m)
    simplify_tolerance = None
    
    dump_basename = os.path.basename(shapefile)
    dump = Dump(dump_path + "/shapefile/"+ dump_basename + ".%04d.json.gz")
    
    extract_shapefile(shapefile, uri_name, simplify_tolerance)
    
    dump.close()
    

#python shapefile.py "/path/to/shapefile/buildings.shp" "http://example.com/queens/buildings" /path/to/gz_dump 0.002
#python shapefile.py "/home/tim/projects/gaz/queens_buildings/buildings/buildings.shp" "http://example.com/queens/buildings" dump/shp 0.002
