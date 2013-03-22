import sys, json, os, datetime, glob, codecs


from core import Dump

#

def extract_geojson(geojsonfile, uri_name, simplify_tolerance):
    json_data = codecs.open(geojsonfile, "r", "utf-8").read()
    data = json.loads(json_data)

    features = data["features"]
    for feature in features:

        geometry = feature["geometry"]
        properties = feature["properties"]
        

        centroid = feature["geometry"]["coordinates"]
        admin = []    
        alternates = []
        feature_code = "HSTS"
        name = properties.get("Name")

        if name == None:
            continue
            
        timeframe = {}
        source = properties
        updated = datetime.datetime.utcnow().replace(second=0, microsecond=0).isoformat()
        uri = uri_name  + str(feature["id"])
        
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
            "admin":admin
        }
        dump.write(uri, place)
        

 
if __name__ == "__main__":
    geojsonfile, dump_path = sys.argv[1:3]
   
    #simplify_tolerance = .01 # ~ 11km (.001 = 111m)
    simplify_tolerance = None
    uri_name = "http://nrhp.focus.nps.gov/"
    
    dump_basename = os.path.basename(geojsonfile)
    dump = Dump(dump_path + "/json/"+ dump_basename + ".%04d.json.gz")
    extract_geojson(geojsonfile, uri_name, simplify_tolerance)
    
    dump.close()



#python nrhp.py nhrp.shp nrhpdump



#python nrhp.py "/path/to/directory"   /path/to/gz_dump2
