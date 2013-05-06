from ox.django.shortcuts import render_to_json_response

class CheckPermissions(object):

    def user_has_perms(self, request):
        path, user, method = (request.path, request.user, request.method,)
        if not path.startswith("/1.0/"):
            return True
        if method == 'GET':
            return True

        if method in ['POST', 'PUT', 'DELETE']:
            if not user.is_authenticated():
                return False
            else:
                return True

        return True   


    def process_request(self, request):
        if self.user_has_perms(request):
            return None
        else:
            return render_to_json_response({'error': 'Insufficient permissions'}, status=403)
