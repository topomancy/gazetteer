import csv
import sys
csv.field_size_limit(1000000000)

# python parse_geonames.py /home/tim/work/gazatteer/allCountries.txt | psql gaztest

#The main 'geoname' table has the following fields :
#---------------------------------------------------
#geonameid         0: integer id of record in geonames database
#name              1: name of geographical point (utf8) varchar(200)
#asciiname         2: name of geographical point in plain ascii characters, varchar(200)
#alternatenames    3: alternatenames, comma separated varchar(5000)
#latitude          4: latitude in decimal degrees (wgs84)
#longitude         5: longitude in decimal degrees (wgs84)
#feature class     6: see http://www.geonames.org/export/codes.html, char(1)
#feature code      7: see http://www.geonames.org/export/codes.html, varchar(10)
#country code      8: ISO-3166 2-letter country code, 2 characters
#cc2               9: alternate country codes, comma separated, ISO-3166 2-letter country code, 60 characters
#admin1 code       10: fipscode (subject to change to iso code), see exceptions below, see file admin1Codes.txt for display names of this code; varchar(20)
#admin2 code       11: code for the second administrative division, a county in the US, see file admin2Codes.txt; varchar(80) 
#admin3 code       12: code for third level administrative division, varchar(20)
#admin4 code       13: code for fourth level administrative division, varchar(20)
#population        14: bigint (8 byte int) 
#elevation         15: in meters, integer
#dem               16: digital elevation model, srtm3 or gtopo30, average elevation of 3''x3'' (ca 90mx90m) or 30''x30'' (ca 900mx900m) area in meters, integer. srtm processed by cgiar/ciat.
#timezone          17: the timezone id (see file timeZone.txt) varchar(40)
#modification date 18: date of last modification in yyyy-MM-dd format
#G, geonameid, name, feature class, feature code, country code, admin1, modification date, [latitude - longitude]

#G', row[0], row[1], row[6], row[7], row[8], row[10], row[18], geom(row[4] row[5]

    #source char(1),
    #id varchar(255),
    #name varchar(255),
    #feature_class varchar(255),
    #feature_type varchar(255),
    #feature_code char(5),
    #country char(2),
    #admin1 char(2),
    #updated timestamp with time zone,
    #geom geometry

def parse_csv(geonames_file):
    csv_reader = csv.reader(open(geonames_file, 'rb'), dialect='excel-tab')
    for row in csv_reader:
        if len(row[0]) > 2:
            out_line = ['G', row[0], row[1], row[6], row[7], row[8], row[10], row[18]+" 00:00:00+00", "POINT("+row[4]+" "+row[5]+")" ] 
            print "\t".join(out_line)
            
    return geonames_file

if __name__ == '__main__':
    geonames_file = sys.argv[1]
    print("BEGIN TRANSACTION;");
    print "COPY gazetteer (source, id, name, feature_class, feature_code, country, admin1, updated, geom) FROM stdin;"
    parse_csv(geonames_file)
    print("\\.");
    print("COMMIT;");
    
    
