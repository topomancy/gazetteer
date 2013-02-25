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

    

    
