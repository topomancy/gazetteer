# pass in shapefile 
#open shapefile
import sys
import ogr

dataset = ogr.Open( "/home/tim/projects/gaz/queens_buildings/buildings/buildings.shp" )

lyr = dataset.GetLayer()
lyr.ResetReading()
feat_defn = lyr.GetLayerDefn()
print feat_defn

for feature in lyr:

    feat_defn = lyr.GetLayerDefn()
    for i in range(feat_defn.GetFieldCount()):
        field_defn = feat_defn.GetFieldDefn(i)
        field_name = field_defn.GetName()
        field_value = feature.GetField(i)
        print [field_name, field_value]

    geom = feature.GetGeometryRef()
    centroid = [geom.Centroid().GetX(), geom.Centroid().GetY()]
    print centroid #geom.Centroid().ExportToWkt()
    
    geometry = geom.ExportToJson()
    print geometry
    

ds = None

#for feat in layer:
    #print feat

#get geometry

#get mapping

#shapely to get centroid

#shapely to convert to geojson

#export to es index 
