from django.db import models
import csv
from django.conf import settings
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser


class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')
 
        user = self.model(
            email=UserManager.normalize_email(email),
        )
 
        user.set_password(password)
        user.save(using=self._db)
        return user
 
    def create_superuser(self, email, password):
        user = self.create_user(email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(max_length=254, unique=True, db_index=True)
 
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
 
    objects = UserManager()
 
    USERNAME_FIELD = 'email'
 
    def get_full_name(self):
        # For this case we return email. Could also be User.first_name User.last_name if you have these fields
        return self.email
 
    def get_short_name(self):
        # For this case we return email. Could also be User.first_name if you have this field
        return self.email
 
    def __unicode__(self):
        return self.email
 
    def has_perm(self, perm, obj=None):
        # Handle whether the user has a specific permission?"
        return True
 
    def has_module_perms(self, app_label):
        # Handle whether the user has permissions to view the app `app_label`?"
        return True
 
    @property
    def is_staff(self):
        # Handle whether the user is a member of staff?"
        return self.is_admin


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

    

    
