from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
import json
from place import *

def index(request):
    places_count = Place.objects.count("*")
    return render_to_response("index.html", {'total_count' : places_count})

def search(request):
    query = request.GET.get('query', '')
    results = ''
    if query:
        results = Place.objects.search(query)["places"]
        total = Place.objects.search(query)["total"]
    return render_to_response("search.html", {'results' : results, 'total': total})
    
def detail(request, place_id):
    place = Place.objects.get(place_id)
    geojson = json.dumps(place.to_geojson())
    return render_to_response("detail.html", {'place' : place, 'place_geojson':geojson})
    
