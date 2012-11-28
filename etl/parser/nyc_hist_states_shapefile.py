import sys, json, os, datetime

from shapely.geometry import asShape, mapping
from fiona import collection

from core import Dump


def extract_shapefile(shapefile, uri_name, simplify_tolerance=None):
    
    for feature in collection(shapefile, "r"):
        
        geometry = feature["geometry"]
        properties = feature["properties"]
        #calculate centroid
        geom_obj = asShape(geometry)
        if simplify_tolerance:
            geom_obj = geom_obj.simplify(simplify_tolerance)
        
        try:
            centroid = [geom_obj.centroid.x , geom_obj.centroid.y]    
        except AttributeError:
            print "Error: ", feature
            continue
        geometry = json.dumps(mapping(geom_obj))

            
        if properties["FULL_NAME"]:
            name = properties["FULL_NAME"]
                    
        #feature code mapping
        feature_code = "ADM1H"
                
        source = properties  #keep all fields anyhow
        
        # unique URI which internally gets converted to the place id
        # Must be unique!
        uri = uri_name + "." + properties["ID"] + "."+ str(properties["VERSION"])
         
        timeframe = {"start_date": properties["START_DATE"], "end_date": properties["END_DATE"]}
        
        #TODO admin? for counties?
        
        updated = "2011-10-01"
        
        
        area = properties["AREA_SQMI"]
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
            "admin":[],
            "area": area
            
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

#python shapefile.py "/home/tim/projects/gaz/NYPL_Gazetteer_Data/Historical County Boundaries/NY_Historical_Counties/NY_Historical_Counties.shp" "http://example.com"  "dump2"

#python shapefile.py "/path/to/shapefile/buildings.shp" "http://maps.nypl.org/warper/layers/870" /path/to/gz_dump 0.002

#{'START_N': 16620507, 'AREA_SQMI': 3526.0, 'NAME': u'HAMPSHIRE (Mass.)', 'END_DATE': '1669-05-18', 'CITATION': u'(Mass. Recs., vol. 4, pt. 2:52)', 'ID': u'mas_hampshire', 'CNTY_TYPE': u'County', 'STATE': u'MA', 'VERSION': 1, 'FIPS': u'25015', 'END_N': 16690518, 'FULL_NAME': u'HAMPSHIRE (Mass.)', 'DATASET': u'NY_Historical_Counties', 'START_DATE': '1662-05-07', 'CHANGE': u'HAMPSHIRE (Mass.) created from non-county area in Mass. colony (towns of Springfield, Northampton, Hadley, and all territory within 30 miles). HAMPSHIRE included a small area in present N.Y. known as "Boston Corner". Eastern boundary was indefinite.'}
