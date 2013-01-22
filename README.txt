Topomancy LLC Gazetteer installation

Install:
    python-pip
    python-virtualenv
    python-psycopg2
    postgresql-postgis-8.4
    postgresql-contrib-8.4
    apache2
    libapache2-mod-wsgi


Setup python virtualenv and install dependencies:
    cd gazetteer
    virtualenv .
    . bin/activate
    pip -E . install -r requirements.txt
    

Update Database:

python manage.py syncdb

If this is your first time doing this, you will be prompted to create a superuser for use when logging in for the first time.

Import Feature Codes:

download from http://download.geonames.org/export/dump/featureCodes_en.txt

python manage.py shell
>>> from gazetteer.models import FeatureCode
>>> FeatureCode.import_from_csv("/path/to/featureCodes_en.txt")


Develop:
    create gazetteer/local_settings.py by copying gazetteer/local_settings.py.sample and editing values.

    . bin/activate
    python manage.py shell

    python manage.py runserver

Note:

     You can run "python manage.py shell_plus" to get a more awesome
django shell with all your models auto-imported.

     You can run "python manage.py runserver_plus" to get better
tracebacks / debugging in the browser for errors. Niceness is you can
open up a python shell in the browser at any point in the trace-back
and get a live debug environment.

Deploy:
    create gazetteer/local_settings.py
    copy conf/apache2.conf to /etc/apache2/sites-available and edit it
    
    To copy static files and serve them correctly on the server:
        python manage.py collectstatic
