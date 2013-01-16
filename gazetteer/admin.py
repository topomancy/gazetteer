from django.contrib import admin
from models import FeatureCode

class FeatureCodeAdmin(admin.ModelAdmin):
    search_fields = ('name', 'cls', 'typ', 'description',) 
    list_display = search_fields[:3]
    list_filter = search_fields[1:3]

admin.site.register(FeatureCode, FeatureCodeAdmin)



#admin.site.register(Dummy)
