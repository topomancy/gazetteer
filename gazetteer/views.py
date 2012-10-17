from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404

from place import *

def index(request):
    places_count = Place.objects.count("*")
    dam_count = Place.objects.count("dam")
    return render_to_response("index.html", {'total_count' : places_count, 'dam_count' : dam_count})

def search(request):
    query = request.GET.get('query', '')
    results = ''
    if query:
        results = Place.objects.search(query)["places"]
        total = Place.objects.search(query)["total"]
    return render_to_response("search.html", {'results' : results, 'total': total})
    

