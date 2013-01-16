from django.db import models
import csv

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

    

    
