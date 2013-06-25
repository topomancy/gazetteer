import bz2, re, math, urllib, sys

print >>sys.stderr, "extracting coordinates"
# <http://dbpedia.org/resource/Alabama> <http://www.georss.org/georss/point> "33.0 -86.66666666666667"@en .
coord_regex = re.compile(r'.*/resource/(\S+).*"(-?\d+\.\d+) (-?\d+\.\d+)"')
coords = {}
for line in bz2.BZ2File("geo_coordinates_en.nt.bz2"):
    match = coord_regex.findall(line)
    if not match: continue
    print >>sys.stderr, "\r", len(coords), 
    name, lat, lon = match[0]
    coords[name] = (lat, lon)

print >>sys.stderr, "\rextracting counts"
counts = {}
for line in file("geo_counts.txt"):
    print >>sys.stderr, "\r", len(counts), 
    name, count = line.strip().split("\t")
    counts[name] = int(count)

high_count = max(counts.values())
for name, count in counts.items():
    count = float(count) / high_count
    name = urllib.unquote(name).decode('utf8')
    lat, lon = coords[name] if name in coords else ("0", "0")
    print "\t".join(name, count, lon, lat)
