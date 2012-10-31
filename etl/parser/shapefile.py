# pass in shapefile 
#open shapefile
import sys
import ogr
from fiona import collection

dataset = ogr.Open( "/home/tim/projects/gaz/queens_buildings/buildings/buildings.shp" )
#buildings
#id origin + shapefile_name + id 
#['user_id', 761] (source > properties
#['layer_id', 870] --- (source > properties
#['created_at', '2012/10/23']
#['updated_at', '2012/10/23'] -- updated  (date)
#['comment', None]  (source > properties > comment)
#['name', None]  -- (source > properties > name)
#['number', None] (source > properties > number)
#['street', 'Fresh Meadow Road'] (source > properties > street)
#['materials', 'brick'] (source > properties > material)
#['use_type', None] -- feature_code (source > properties > use_type)
#['use_subt82', None] (source > properties > use_subtype)
#['layer_year', '1909']  -- timeframe

#place = {
    #"name": geoname["name"],
    #"centroid": centroid,
    #"feature_code": geoname["feature_code"],
    #"geometry": {"type": "Point", "coordinates": centroid},
    #"is_primary": True,
    #"source": geoname,
    #"alternate": names,
    #"updated": geoname["changed_at"],
    #"population": population,
    #"uris": [uri],
    #"relationships": [],
    #"timeframe": {},
    #"admin": []
#}
    
lyr = dataset.GetLayer()
lyr.ResetReading()
feat_defn = lyr.GetLayerDefn()
print feat_defn
count = 0
for feature in lyr:
    count = count + 1
    #uri = "http://maps.nypl.org/digitizer/queens_buildings_bromley_1909_" + count 
    feat_defn = lyr.GetLayerDefn()
    name = ""
    for i in range(feat_defn.GetFieldCount()):
        field_defn = feat_defn.GetFieldDefn(i)
        field_name = field_defn.GetName()
        field_value = feature.GetField(i)
        #print [field_name, field_value]
        #print feature.GetFieldIndex("name")
    updated_at = feature.GetField(feature.GetFieldIndex("updated_at"))
    
    name = feature.GetField(feature.GetFieldIndex("name"))
    if name:
        print name
        print updated_at
        
    
    geom = feature.GetGeometryRef()
    centroid = [geom.Centroid().GetX(), geom.Centroid().GetY()]
    #print centroid #geom.Centroid().ExportToWkt()
    
    geometry = geom.ExportToJson()
    #print geometry
    


ds = None

#for feat in layer:
    #print feat

#get geometry

#get mapping

#shapely to get centroid

#shapely to convert to geojson

#export to es index 
