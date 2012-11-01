# pass in shapefile 
#open shapefile
import sys
from shapely.geometry import asShape
from fiona import collection


for feature in collection("/home/tim/projects/gaz/queens_buildings/buildings/buildings.shp", "r"):
    
    geometry = feature["geometry"]
    properties = feature["properties"]
    
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
    
    centroid = [asShape(geometry).centroid.x , asShape(geometry).centroid.y]
    
    use_types = {
        "Residential" : "HSE",
        "Worship" : "CTTR",
        "Educational" : "SCH",
        "Commercial": "BLDO",
        "Industrial" : "MFG",
        "Health": "HSP",
        "Transport":"BLDG",
        "Military":"INSM",
        "unknown": "BLDG"
    }
    use_sub_types = {
            "Apartments": "HSE",
            "Houses": "HSE",
            "Church" : "CH",
            "Synagogue" : "CTRR",
            "School": "SCH",
            "Railroad System" : "RSTN",
            "Bank" : "BANK",
            "Hotel":"HTL",
            "Library": "LIBR",
            "Freight House":"RSTN",
            "Hospital" : "HSP",
            "Lumber Yard":"MLSW"
    }
    #
    # SEE https://github.com/timwaters/mapwarper/blob/master/app/controllers/digitize_controller.rb
    # For all the types
    # Currently will break with a KeyError if the mapping is not there.
    feature_code = "BLDG"
    if properties["use_type"]:
        feature_code = use_types[properties["use_type"]]
    if properties["use_subt82"]:
        feature_code = use_sub_types[properties["use_subt82"]]
    
    source = properties
    uri = "/nypl/warper/layer/1234/queens_buildings/buildings.shp,"+ feature["id"]
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
    print place


#export to es index 

