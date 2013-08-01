from django.contrib.gis import admin
from models import FeatureCode, Origin, BatchImport, Layer

class FeatureCodeAdmin(admin.ModelAdmin):
    search_fields = ('name', 'cls', 'typ', 'description',) 
    list_display = search_fields[:3]
    list_filter = search_fields[1:3]
    
class OriginAdmin(admin.ModelAdmin):
    search_fields = ('name', 'description', 'code') 
    list_display = search_fields[:3]
    list_filter = search_fields[1:3]
    
class BatchImportAdmin(admin.ModelAdmin):
    exclude = ('record_count','imported_at')
    list_display = ('name','record_count','imported_at')
    
class LayerAdmin(admin.GeoModelAdmin):
    search_fields = ('name', 'description',) 
    list_display = ('id','name','layer_type','date', 'source')

admin.site.register(FeatureCode, FeatureCodeAdmin)
admin.site.register(Origin, OriginAdmin)
admin.site.register(BatchImport, BatchImportAdmin)
admin.site.register(Layer, LayerAdmin)
