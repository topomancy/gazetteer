wget -c http://planet.openstreetmap.org/pbf/planet-120401.osm.pbf

sudo apt-get install build-essential libxml2-dev libgeos-dev libpq-dev libbz2-dev proj libtool automake
sudo apt-get install libprotobuf-c0-dev
sudo apt-get install postgresql-9.1-postgis
sudo apt-get install protobuf-c-compiler
sudo apt-get install postgresql-contrib
sudo apt-get install zlib1g-dev libshp-dev libsqlite3-dev  libgd2-xpm-dev
	libexpat1-dev libgeos-dev libxml2-dev  libsparsehash-dev libv8-dev libicu-dev \
	libgdal1-dev  libprotobuf-dev protobuf-compiler devscripts debhelper  fakeroot \
	doxygen libboost-dev git-core libgeos++-dev
sudo apt-get install gdal-bin

git clone https://github.com/schuyler/osm2pgsql.git
cd osm2pgsql/
dpkg-buildpackage -rfakeroot
cd ..
sudo dpkg -i osm2pgsql*.deb

sudo vi /etc/postgresql/9.1/main/postgresql.conf 

# Tune up PostgreSQL
#
shared_buffers = 6GB 			# about 1/4 of RAM
checkpoint_segments = 128
checkpoint_completion_target = 0.9
effective_cache_size = 12GB		# about 1/2 of RAM
autovacuum = off
work_mem = 32MB				# min 64kB
maintenance_work_mem = 256MB		# min 1MB

sudo vi /etc/sysctl.conf

# Allow PostgreSQL to allocate 6GB of shared memory
#
kernel.shmmax=6615089152

sudo sysctl -w kernel.shmmax=6615089152
sudo /etc/init.d/postgresql restart

sudo su -c 'createuser -s sderle' postgres
createdb template_postgis
psql template_postgis < /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql
psql template_postgis < /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql

time osm2pgsql --latlong --multi-geometry --slim --cache 12000 --input-reader pbf --create --unlogged --hstore-column "name:" --database conflation --style place.style planet-latest.osm.pbf

