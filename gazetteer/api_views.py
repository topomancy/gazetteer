from ox.django.shortcuts import render_to_json_response
from django.core.paginator import Paginator, InvalidPage, EmptyPage
from django.db.models import Q
#from django.http import HttpResponse
from place import Place
from pyelasticsearch.exceptions import ElasticHttpNotFoundError    
try:
    import json
except:
    import simplejson as json
from django.views.decorators.csrf import csrf_exempt
from django.http import QueryDict
import datetime
import math
from models import FeatureCode
from django.contrib.gis.geos import GEOSGeometry

@csrf_exempt
def place_json(request, id):

    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)                

    if request.method == 'GET':
        '''
            Return GeoJSON for Place
        '''
        geo_json = place.to_geojson()
        return render_to_json_response(geo_json)

    elif request.method == 'PUT':
        '''
            Takes a GeoJSON string as PUT data and saves Place
            Saves and returns  back GeoJSON for place.
        '''
        #FIXME: check permissions
#        if not request.user.is_staff():
#            return render_to_json_response({'error': 'You do not have permissions to edit this place.'}, status=403)    

        geojson = json.loads(request.body)
        json_obj = geojson.pop("properties")
        json_obj['geometry'] = geojson['geometry']

        #handle getting centroid:
        centroid = GEOSGeometry(json.dumps(json_obj['geometry'])).centroid
        json_obj['centroid'] = centroid.coords      
        
        json_obj['updated'] = datetime.datetime.now().isoformat() #FIXME
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
    '''
        Takes GET params:
            q: search string
            bbox: bounding box string
            per_page: results per page int, default=100
            page: page no (starting with 1) int, default=1

        Returns:
            GeoJSON feed of search results
            Extra properties of feed:
                total: total number of results
                max_score: max score in results (?)
                page: page number
    '''
    query = request.GET.get("q", "")
    per_page = int(request.GET.get("per_page", 100)) #FIXME: add error handling if int conversion fails
    page = int(request.GET.get("page", 1))
    page_0 = page - 1 #model method requires page number to be zero-based whereas API accepts 1-based.
    bboxString = request.GET.get("bbox", "")
    if bboxString:
        bbox = [float(b) for b in bboxString.split(",")]
    else:
        bbox = None
    result = Place.objects.search(query, bbox=bbox, per_page=per_page, page=page_0)
    total = result['total']
    pages = math.ceil(total / (per_page + .0)) #get total number of pages
     
    ret = {
        'type': 'FeatureCollection',
        'features': [p.to_geojson() for p in result['places']],
        'total': total,
        'page': result['page'],
        'pages': pages,
        'per_page': result['per_page'],
        'max_score': result['max_score']
    }
    return render_to_json_response(ret)


def similar(request, id):
    '''
        Takes place ID
        Returns GeoJSON feed of similar places.
            Extra properties of feed:
                total: total number of similar places
                max_score: max score of similarity (?)
    '''
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)          

    if request.method == 'GET':
        similar_places = place.find_similar()
        geojson = {
            'type': 'FeatureCollection',
            'total': similar_places['total'],
            'max_score': similar_places['max_score'],
            'features': [p.to_geojson() for p in similar_places['places']]
        }
        return render_to_json_response(geojson)
        #return render_to_json_response({'error': 'Not implemented'}, status=501)

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
    '''
        Returns array of revision objects for Place
    '''
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)

    if request.method == 'GET':
        history_json = Place.objects.history(place)
        #history_json = place.get_history()        
        return render_to_json_response(history_json)
        #return render_to_json_response({'error': 'Not implemented'}, status=501)

    else:
        return render_to_json_response({'error': 'Method Not Allowed'}, status=405)


def revision(request, id, revision):
    '''
        Get GeoJSON of a place at given revision
    '''
    try:
        place = Place.objects.get(id)
    except ElasticHttpNotFoundError:
        return render_to_json_response({'error': 'Place not found'}, status=404)

    if request.method == 'GET':
        revision = Place.objects.revision(place,revision)
        geojson = revision['place'].to_geojson()
        geojson['version'] = revision['version']
        geojson['digest'] = revision['digest']
        return render_to_json_response(geojson)
        #revision_json = place.get_revision(revision)        
        #return render_to_json_response(revision_json)
        #return render_to_json_response({'error': 'Not implemented'}, status=501)

    elif request.method == 'PUT':
        #check permissions
        #place.rollback_to(revision)
        return render_to_json_response({'error': 'Not implemented'}, status=501)

    else:
        return render_to_json_response({'error': 'Method Not Allowed'}, status=405)


def add_relationship(request, id1, relationship, id2):
    #do a bunch've checking if valid relationship, has permissions, id1 and id2 exist, and add the relationship.
    return render_to_json_response({'error': 'Not implemented'}, status=501)



def feature_codes_autocomplete(request):
    '''
        Used for autocomplete: return Feature Codes matching GET param 'q'
    '''
    query = request.GET.get("q", "a")
    page_limit = int(request.GET.get("page_limit", 10))
    page = int(request.GET.get("page", 1))
    matched_codes = FeatureCode.objects.filter(Q(cls__icontains=query) | Q(typ__icontains=query) | Q(name__icontains=query) | Q(description__icontains=query))       
    paginator = Paginator(matched_codes, page_limit)
    results = paginator.page(page)
    items = [obj.to_json() for obj in results.object_list]  
    return render_to_json_response({
        'items': items,
        'has_next': results.has_next()
    })    


