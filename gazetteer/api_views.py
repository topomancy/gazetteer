from ox.django.shortcuts import render_to_json_response
#from django.http import HttpResponse
from place import Place
from pyelasticsearch.exceptions import ElasticHttpNotFoundError    


def place_json(request, id):
    
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)                

    if request.method == 'GET':
        # geo_json = place.to_geojson()
        p = place.source
        geo_json = p.pop('geometry')
        geo_json['properties'] = p
        return render_to_json_response(geo_json)
        #Return GeoJSON for place

    if request.method == 'PUT':
        #check permissions / Handle saving PUT data
        return render_to_json_response({'error': 'Not implemented'}, status=501)

    if request.method == 'DELETE':
        #check permissions / delete object       
        return render_to_json_response({'error': 'Not implemented'}, status=501)

    else:
        return render_to_json_response({'error': 'Method Not Allowed'}, status=405)

def search(request):
    #return search results as geojson
    query = request.GET.get("q", "")
    bbox = request.GET.get("bbox", "")
    results = Place.objects.search(query).hits['hits']
    ret = {
        'type': 'FeatureCollection',
        'features': []
        #FIXME: add pagination variables / total count
    }
    for r in results:
        place_geojson = r.source.pop("geometry")
        place_geojson['properties'] = r.source
        ret['features'].append(place_geojson)

    return render_to_json_response(ret)


def siimilar(request, id):
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)          

    if request.method == 'GET':
        #similar_geojson = place.get_similar()        
        #return render_to_json_response(similar_geojson)

    else:
        return render_to_json_response({'error': 'Method Not Allowed'}, status=405)



