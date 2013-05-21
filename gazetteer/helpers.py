from instance_settings import *
import settings
from models import Origin

def get_settings():
    return {
        'debug': settings.DEBUG,
        'api_base': API_BASE,
        'osmUrl': OSM_URL,
        'osmAttrib': OSM_ATTRIBUTION,
        'centerLat': CENTER_LAT,
        'centerLon': CENTER_LON,
        'defaultZoom': DEFAULT_ZOOM,
        'smoothFactor': SMOOTH_FACTOR,
        'minYear': MIN_YEAR,
        'maxYear': MAX_YEAR,
        'origins': [origin.to_json() for origin in Origin.objects.all()]
    }
