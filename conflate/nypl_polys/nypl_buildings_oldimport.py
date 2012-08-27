import csv
import sys
csv.field_size_limit(1000000000)
#python nypl_buildingsoldimport.py /path/to/csv.file   | psql oldgaztest


def parse_buildings_csv(geonames_file):
    csv_reader = csv.reader(open(geonames_file, 'rb'), delimiter = ",")
    csv_reader.next()
    for row in csv_reader:
            use_codes = {"Residential":"323", "unknown":"257", "Industrial":"344", "Worship":"269", "Commercial":"258", "Transport":"464", "Educational": "430", "Health":"325"}
            feature_type_id = "257"
            if row[10]:
                 feature_type_id = use_codes[row[10]]
            out_line = [row[6], feature_type_id, "NY", "New York", "9472", "true","226", row[12]  ] 

            print "\t".join(out_line)
            
    return geonames_file
    

if __name__ == '__main__':
    csv_file = sys.argv[1]
    print("BEGIN TRANSACTION;");
    
    print "COPY places_feature ( preferred_name, feature_type_id, admin1, admin2, authority_record_id, is_primary, time_frame_id, geometry) FROM stdin;"
    parse_buildings_csv(csv_file)

    print("\\.");
    print("COMMIT;");
    
    
    #0 FID, 1 user_id,2 layer_id,3 created_at,4 updated_at,5 comment, 6 name,7 number,8 street,9 materials,10 use_type, 11 use_subtype, 12 geom,13 layer_year
#buildings.67129,1703,861,,,Framed Dwellings,,63,Eighth Street,,Residential,Houses,"POLYGON ((-73.995730970975 40.732281283726, -73.99564079344 40.732251781381, -73.99561397135 40.732288366189, -73.995646157858 40.732300561121, -73.99564079344 40.732316821026, -73.995654204485 40.732320886001, -73.99570285276 40.732321411992, -73.995701672975 40.732323095695, -73.995730970975 40.732281283726))",1854

    #id    | authority_record_id |               url               |       preferred_name       | feature_type_id | admin1 |  admin2  | is_primary | time_frame_id |                      geometry                      
#---------+---------------------+---------------------------------+----------------------------+-----------------+--------+----------+------------+---------------+----------------------------------------------------
 #2487377 |                     | http://www.geonames.org/4645014 | New Emanuel Baptist Church |             269 | TN     | Hamilton | t          |               | 0101000020E6100000C4EBFA05BB5355C05DBF60376C834140
