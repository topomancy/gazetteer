# pass in shapefile 
#open shapefile
import sys, json, os, datetime

from shapely.geometry import asShape, mapping
from shapely import wkt
from fiona import collection
from geojson import dumps

from core import Dump, tab_file

columns = {
    "perris": ["FID", "comment", "additional_information", "secondary_address_temp",
                "secondary_street", "secondary_number", "name", "number", "street", 
                "materials", "use_type", "use_subtype", "layer_year", "geom"]
                }
#OGRFeature(FinalCleanedData_Perris1854):110
#FID (String) = buildings.93453
#comment (String) = second class;slate or metal roof not coped
#additional_information (String) = 
#secondary_address_temp (String) = 
#secondary_street (String) = 
#secondary_number (String) = 
#name (String) = 
#number (String) = 107
#street (String) = Sullivan Street
#materials (String) = brick or stone
#use_type (String) = Residential
#use_subtype (String) = 
#geom (String) = POLYGON ((-74.002852247334 40.725762801627, -74.002720642693 40.725696141185, -74.002673546257 40.725755627238, -74.0028049745 40.725820673231, -74.002852247334 40.725762801627))
#layer_year (String) = 1854

def extract_shapefile(shapefile, uri_name, simplify_tolerance=None):
    
    features = tab_file(shapefile, columns["perris"])
   
    for feature in features:
        for k,v in feature.items():
            feature[k] = v.strip()

        
        wkt_geom = feature["geom"]
        del feature["geom"]
        
        geom_obj = wkt.loads(wkt_geom)
        
        centroid = [geom_obj.centroid.x , geom_obj.centroid.y

        geometry =  geojson.dumps(geom_obj)
        

        #name
        
        #alt_name
        
        #feature code mapping
        feature_code = "BLDG"
                
        source = feature  #keep all fields anyhow
        
        # unique URI which internally gets converted to the place id
        # Must be unique!
        uri = uri_name + "." + feature["NPS_Reference_Number"]
         
        timeframe = {}
        
        updated = "2009-06-23"

        place = {
            "name":name,
            "centroid":centroid,
            "feature_code": feature_code,
            "geometry":geometry,
            "is_primary": True,
            "source": source,
            "updated": updated,
            "uris":[uri],
            "relationships": [],
            "timeframe":timeframe,
            "admin":[]

        }
        print place
        #dump.write(uri, place)
        

if __name__ == "__main__":
    shapefile, uri_name, dump_path = sys.argv[1:4]
    
    #simplify_tolerance = .01 # ~ 11km (.001 = 111m)
    simplify_tolerance = None
    
    dump_basename = os.path.basename(shapefile)
    dump = Dump(dump_path + "/shapefile/"+ dump_basename + ".%04d.json.gz")
    
    extract_shapefile(shapefile, uri_name, simplify_tolerance)
    
    dump.close()


#python shapefile.py "/path/to/shapefile/buildings.shp" "http://maps.nypl.org/warper/layers/870" /path/to/gz_dump 0.002


