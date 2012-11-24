# pass in shapefile 
#open shapefile
import sys, json, os, datetime

from shapely.geometry import asShape, mapping
from fiona import collection

from core import Dump, tab_file


#{'City': 'Woodstock ', 'Date_Listed': '19890119', 'Notes': '', 'Historic_Place_Name': "Taylor's Corner ", 'NPS_Reference_Number': '88003220', 'Longitude': '-72.01283', 'County': 'Windham ', 'State': 'CONNECTICUT', 'Address': 'Rt. 171', Latitude': '41.9486', 'Type': 'centroid'}



columns = {
    "nrhp": ["Historic_Place_Name", "Address", "City", "County", "State","Latitude", "Longitude",
                "NPS_Reference_Number", "Date_Listed", "Notes", "Type", "Geocode_Match"]
                }


def extract_shapefile(shapefile, uri_name, simplify_tolerance=None):
    
    features = tab_file(shapefile, columns["nrhp"])
   
    for feature in features:
        for k,v in feature.items():
            feature[k] = v.strip()


        if feature["Historic_Place_Name"] == "Historic_Place_Name":
            continue
            
        centroid = [feature["Longitude"], feature["Latitude"]]
        geometry =  {"type": "Point", "coordinates": centroid}
        

        name_array = []
        if feature["Historic_Place_Name"]:
            name_array.append(feature["Historic_Place_Name"])
            
        if feature["Address"]:
            name_array.append(feature["Address"])
        
        name = ','.join(name_array)
        
        
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


