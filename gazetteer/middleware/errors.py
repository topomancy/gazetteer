from ox.django.shortcuts import render_to_json_response
from gazetteer.instance_settings import API_BASE

class APIExceptionMiddleware(object):
    def process_exception(self, request, exception):
        if not request.path.startswith(API_BASE): #if its not an API request, handle exceptions normally
            return None
        error_msg = unicode(exception)
        return render_to_json_response({'error': error_msg}, status=500)
