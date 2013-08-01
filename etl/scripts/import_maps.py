import os
import sys
sys.path.append('../../')
os.environ['DJANGO_SETTINGS_MODULE'] = 'gazetteer.settings'
from django.contrib.gis.geos import Polygon
from django.db.utils import IntegrityError
from gazetteer.models import Layer

import json


def import_from_json(path, layer_type):
    #imports from a warper json file
    json_file=open(path)
    data = json.load(json_file)
    json_file.close()

    items = data["items"]

    for item in items:
        #dont load in stuff with no bbox
        if not item.get("bbox"):
            continue
            
        extents = [float(b) for b in item["bbox"].split(",")]
        bbox = Polygon.from_bbox(tuple(extents))

        date = None
        if item["depicts_year"]:
            date = item["depicts_year"]+"-01-01"

        layer = None
        if layer_type == "map":
            layer = Layer(name=item["title"],
                        description=item["description"],
                        layer_type = "map",
                        service_type = "tile",
                        source = "NYPL Warper",
                        pattern = "http://maps.nypl.org/warper/maps/tile/"+str(item["id"])+"/{z}/{x}/{y}.png",
                        date= date,
                        bbox= bbox,
                        uris="nypl_warper:"+str(item["id"]) + ",nypl_digitial:"+str(item["nypl_digital_id"]),
                        width= item["width"],
                        height= item["height"])
        else:  #"layer"
            layer = Layer(name=item["name"],
                          layer_type = "atlas",
                          service_type = "tile",
                          source ="NYPL Warper",
                          pattern = "http://maps.nypl.org/warper/layers/tile/"+str(item["id"])+"/{z}/{x}/{y}.png",
                          date= date,
                          bbox= bbox,
                          uris="nypl_warper:"+str(item["id"])

            )
        if layer:
            try:
                layer.save()
                print "Saved ", layer
            except:
                print "Not saved (duplicate probably)", layer.uris
                layer = None
                        

#get json from location, e.g. http://maps.nypl.org/warper/layers.json?&per_page=2
#e.g. http://maps.nypl.org/warper/maps.json?show_warped=1&per_page=2

#1. activate the virtual env '.bin/activate'
#2. cd to scripts directory  'cd etl/scripts'
#3. run script passing in path to downloaded json file and the type it is (map or atlas) 'python import_maps.py /home/to/maps.json' "map"
if __name__ == "__main__":
    json_path, layer_type = sys.argv[1:3]
    import_from_json(json_path, layer_type)

#python import_maps.py "/home/tim/work/gazatteer/gazetteer/data/warper_maps.json" "map"