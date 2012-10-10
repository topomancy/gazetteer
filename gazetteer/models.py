from django.db import models

class Dummy(models.Model):
    question = models.CharField(max_length=200)
