from django.template import Context, loader
from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404

from place import *

def index(request):
    places_count = Place.objects.count("22")
    return render_to_response("index.html", {'count' : places_count})

