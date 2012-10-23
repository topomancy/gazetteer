from ox.django.shortcuts import render_to_json_response
#from django.http import HttpResponse
from place import Place
from pyelasticsearch.exceptions import ElasticHttpNotFoundError    
try:
    import json
except:
    import simplejson as json
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def place_json(request, id):
    
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)                

    if request.method == 'GET':
        geo_json = place.to_geojson()
        #Return GeoJSON for place
        return render_to_json_response(geo_json)

    elif request.method == 'POST':
        #check permissions / Handle saving POST data
#        if not request.user.is_staff():
#            return render_to_json_response({'error': 'You do not have permissions to edit this place.'}, status=403)    
#        
        geojson = json.loads(request.POST['json'])
        json_obj = geojson.pop("properties")
        json_obj['geometry'] = geojson
        p = Place(json_obj)

        if request.user.is_authenticated():
            user = request.user.username
        else:
            user = 'unknown'
        metadata = { #What all does metadata need? Should this be in a function?
            'user': user
        }

        Place.objects.save(p, metadata=metadata)
        return render_to_json_response(p.to_geojson())
        

    elif request.method == 'DELETE':
        #check permissions / delete object       
        return render_to_json_response({'error': 'Not implemented'}, status=501)

    else:
        return render_to_json_response({'error': 'Method Not Allowed'}, status=405)


def search(request):
    #return search results as geojson
    query = request.GET.get("q", "")
    bboxString = request.GET.get("bbox", "")
    if bboxString:
        bbox = [float(b) for b in bboxString.split(",")]
    else:
        bbox = None
    result = Place.objects.search(query, bbox=bbox)
    total = result['total']
    places = result['places']
    ret = {
        'type': 'FeatureCollection',
        'features': [],
        'total': total
        #FIXME: add pagination variables / total count
    }
    for p in places:
        ret['features'].append(p.to_geojson())

    return render_to_json_response(ret)


def similar(request, id):
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)          

    if request.method == 'GET':
        #similar_geojson = place.get_similar()        
        #return render_to_json_response(similar_geojson)
        return render_to_json_response({'error': 'Not implemented'}, status=501)

    else:
        return render_to_json_response({'error': 'Method Not Allowed'}, status=405)


def hierarchy(request, id):
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)

    if request.method == 'GET':
        #hierarchy_json = place.get_hierarchy()        
        #return render_to_json_response(hierarchy_json)
        return render_to_json_response({'error': 'Not implemented'}, status=501)

    else:
        return render_to_json_response({'error': 'Method Not Allowed'}, status=405)


def history(request, id):
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)

    if request.method == 'GET':
        #history_json = place.get_history()        
        #return render_to_json_response(history_json)
        return render_to_json_response({'error': 'Not implemented'}, status=501)

    else:
        return render_to_json_response({'error': 'Method Not Allowed'}, status=405)


def revision(request, id, revision):
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)

    if request.method == 'GET':
        #revision_json = place.get_revision(revision)        
        #return render_to_json_response(revision_json)
        return render_to_json_response({'error': 'Not implemented'}, status=501)

    elif request.method == 'PUT':
        #check permissions
        #place.rollback_to(revision)
        return render_to_json_response({'error': 'Not implemented'}, status=501)

    else:
        return render_to_json_response({'error': 'Method Not Allowed'}, status=405)


def add_relationship(request, id1, relationship, id2):
    #do a bunch've checking if valid relationship, has permissions, id1 and id2 exist, and add the relationship.
    return render_to_json_response({'error': 'Not implemented'}, status=501)

