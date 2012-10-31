# pass in shapefile 
#open shapefile
import sys
import ogr

dataset = ogr.Open( "/home/tim/projects/gaz/queens_buildings/buildings/buildings.shp" )

lyr = dataset.GetLayer()
lyr.ResetReading()
feat_defn = lyr.GetLayerDefn()
print feat_defn

for feat in lyr:

    feat_defn = lyr.GetLayerDefn()
    for i in range(feat_defn.GetFieldCount()):
        field_defn = feat_defn.GetFieldDefn(i)
        #print field_defn.GetName()
        # Tests below can be simplified with just :
        # print feat.GetField(i)
        print [field_defn.GetName(), feat.GetField(i)]


    geom = feat.GetGeometryRef()
    if geom is not None and geom.GetGeometryType() == ogr.wkbPoint:
        print "%.3f, %.3f" % ( geom.GetX(), geom.GetY() )
    else:
        print "no point geometry\n"

ds = None

#for feat in layer:
    #print feat

#get geometry

#get mapping

#shapely to get centroid

#shapely to convert to geojson

#export to es index 
