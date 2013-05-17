from django.contrib.gis.db import models
import csv

class AdminBoundary(models.Model):
    uuid = models.CharField(max_length=24, blank=False, unique=True)
    name = models.CharField(max_length=256)
    alternate_names = models.TextField()
    feature_code = models.CharField(max_length=8)
    uri = models.CharField(max_length=256)
    geom = models.MultiPolygonField(blank=True, null=True)
    queryable_geom = models.MultiPolygonField(blank=True, null=True)
    objects = models.GeoManager()
    
    def __unicode__(self):
        return "<%s %s, %s, %s>" % (self.__class__, self.uuid, self.name, self.feature_code) 
    
    def to_place_json(self):
        return {"id" : str(self.uuid), "feature_code" : self.feature_code,
                     "name" : self.name, "alternate_names": self.alternate_names}

class FeatureCode(models.Model):
    cls = models.CharField(max_length=3, blank=True)
    typ = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=64, blank=True)
    description = models.TextField(blank=True)

    def __unicode__(self):
        return self.typ

    def to_json(self):
        return {
            'id': self.typ,
            'cls': self.cls,
            'typ': self.typ,
            'name': self.name,
            'description': self.description
        }

    @classmethod
    def import_from_csv(kls, path):
        CsvFile = csv.reader(open(path), delimiter="\t")
        for row in CsvFile:
            cls, typ = row[0].split(".")
            fcode = kls(cls=cls, typ=typ, name=row[1], description=row[2])
            fcode.save()
            print "saved " + row[1]

#an Origin represents a URI source, with a name etc
#example - an example URI from a place
#code - the code to use in the query string (uris:*loc.gov*)
#TO load in the data from fixtures: python manage.py loaddata origins_nypl.json
class Origin(models.Model):
    name = models.CharField(max_length=128, unique=True)
    description = models.TextField(blank=True)
    example = models.CharField(max_length=128, blank=True)
    code = models.CharField(max_length=128, unique=True)
    
    def __unicode__(self):
        return "%s %s, %s" % (self.__class__, self.name, self.code) 
    
    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'example' : self.example,
            'code' : self.code
        }
