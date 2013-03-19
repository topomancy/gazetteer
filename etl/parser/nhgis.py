import sys, json, os, datetime, glob

from shapely.geometry import asShape, mapping
from fiona import collection

from core import Dump

#
# Opens a directory containing all the shapefiles, and extracts
#

def extract_shapefile(shapefile, uri_name, simplify_tolerance, country_code, geo_type, year):
    #with collection(shapefile, 'r') as source:
    #  #print country_code, geo_type, year, os.path.basename(shapefile), source.schema["properties"].keys()
    
    for feature in collection(shapefile, "r"):
        
        geometry = feature["geometry"]
        properties = feature["properties"]
        geom_obj = asShape(geometry)
        
        if simplify_tolerance:
            geometry = mapping(geom_obj.simplify(simplify_tolerance))

        try:
            centroid = [geom_obj.centroid.x , geom_obj.centroid.y]
        except AttributeError:
            print "Error: ", feature
            continue
            
        alternates = []
        name = None
        feature_code = "ADM2H"
        if geo_type == "state":
            feature_code = "ADM1H"
            name = properties.get("STATENAM")
            
        if geo_type == "county":
            
            name = properties.get("NHGISNAM")
            #admin? 
            
        if name == None:
            continue
            
        timeframe = {}
        
        timeframe = {"start": year+"-01-01", "start_range":0,
                     "end": str(int(year)+9)+"-12-31", "end_range":0}

        source = properties
        updated = datetime.datetime.utcnow().replace(second=0, microsecond=0).isoformat()
        
        uri = uri_name + "/" + feature["id"]
        
        place = {
            "name":name,
            "centroid":centroid,
            "feature_code": feature_code,
            "geometry":geometry,
            "is_primary": True,
            "source": source,
            "alternate": alternates,
            "updated": updated,
            "uris":[uri],
            "relationships": [],
            "timeframe":timeframe,
            "admin":[]
        }

        dump.write(uri, place)
        

 
if __name__ == "__main__":
    shapefile_dir, dump_path = sys.argv[1:3]
   
    
    shapefile_list = glob.glob(shapefile_dir + "/*.shp")
    
    #print shapefile_list
    for shapefile_path in shapefile_list:
        dump_basename = os.path.basename(shapefile_path)
        country_code,geo_type,year = dump_basename[:-4].split("_")
        uri_name = "http://nhgis.org/"+country_code+"/"+geo_type+"/"+year

        simplify_tolerance = .001
  
        dump = Dump(dump_path + "/shapefile/"+  dump_basename.strip() + ".%04d.json.gz", max_rows=1000)
        
        extract_shapefile(shapefile_path, uri_name, simplify_tolerance, country_code, geo_type, year)
        
        dump.close()

#python nhgis.py  /home/tim/work/gazatteer/nhgis/reprojected nhgisdump

#python nhgis.py "/path/to/directory"   /path/to/gz_dump2
