from core import Dump
import json, re

ns_coords = re.compile(r'([0-9.]+)(?:\D*([0-9.]+))?(?:\D*([0-9.]+))?\D*([NS])')
ew_coords = re.compile(r'([0-9.]+)(?:\D*([0-9.]+))?(?:\D*([0-9.]+))?\D*([EW])')

def coords_to_dms(regex, text):
    dms = regex.search(text)
    if dms:
        dms = dms.groups()
    else:
        return None
    try:
        coord = float(dms[0])
        if dms[1]: coord += float(dms[1]) / 60.0
        if dms[2]: coord += float(dms[2]) / 3600.0
        if dms[3][0] in "SW": coord = -coord 
        if (dms[3][0] in "EW" and -180 <= coord <= 180) or -90 <= coord <= 90:
            return coord
    except ValueError:
        pass
    return None

def get_labels(variants):
    if type(variants) is not list:
        variants = [variants]
    result = []
    for variant in variants:
        if not variant or type(variant) is not dict: continue
        labels = variant.get("variantLabel")
        if not labels: continue
        if type(labels) is not list: labels = [variant["variantLabel"]]
        result.extend(labels)
    return result

def extract_lc_auth(data_path, dump_path):
    dump = Dump(dump_path + "lc_auth/lc_auth.%04d.json.gz")
    for line in file(data_path):
        auth = json.loads(line)
        del auth["isMemberOfMADSScheme"]
        del auth["adminMetadata"]
        alt_names = []
        #print "hasVariant: ", auth.get("hasVariant")
        for label in get_labels(auth.get("hasVariant")):
            alt_names.append({"name": label})
        for label in get_labels(auth.get("hasEarlierEstablishedForm")):
            alt_names.append({"name": label, "type": "historical"})
        geom = None
        has_source = auth.get("hasSource")
        if has_source:
            note = has_source.get("citation-note")
            if note:
                lat = coords_to_dms(ns_coords, note)
                lon = coords_to_dms(ew_coords, note)
                if lat and lon:
                    geom = {"type": "Point", "coordinates": [lon, lat]}
        uri = auth["id"]
        place = {
            "name": auth["authoritativeLabel"],
            "alternate": alt_names,
            "is_primary": True,
            "source": auth,
            "uris": [uri]
        }
        if geom: place["geom"] = geom
        dump.write(uri, place)
    dump.close()



if __name__ == "__main__":
    import sys
    data_path, dump_path = sys.argv[1:3]
    extract_lc_auth(data_path, dump_path)
