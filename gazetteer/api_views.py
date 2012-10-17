from ox.django.shortcuts import render_to_json_response
#from django.http import HttpResponse
from place import Place

def place_json(request, id):
    
    try:
        place = Place.objects.get(id)
    except: #FIXME: catch ElasticHttpNotFound error specifically
        return render_to_json_response({'error': 'Place not found'}, status=404)                

    if request.method == 'GET':
        # geo_json = place.to_geojson()
        p = place.source
        geo_json = p.pop('geometry')
        geo_json['attributes'] = p
        return render_to_json_response(geo_json)
        #Return GeoJSON for place

    if request.method == 'PUT':
        #check permissions / Handle saving PUT data
        return render_to_json_response({'error': 'Not implemented'}, status=500)

    if request.method == 'DELETE':
        #check permissions / delete object       
        return render_to_json_response({'error': 'Not implemented'}, status=500)
