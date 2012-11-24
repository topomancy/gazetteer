from place import Place
from pyelasticsearch.exceptions import ElasticHttpNotFoundError
from django.http import Http404

def get_place_or_404(id):
    try:
        return Place.objects.get(id)
    except ElasticHttpNotFoundError:
        raise Http404
    
